const Groups = require('../model/GroupScheme');
const Expense = require('../model/ExpenseScheme');
const crypto = require("crypto");

// 🔥 Generate Invite Code
function generateCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// ============================
// CREATE GROUP
// ============================
const CreateGroup = async (req, res) => {
  try {
    const { name, currency, members } = req.body;
    const userID = req.user.id;

    if (!name?.trim() || !currency?.trim() || !members?.length) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const cleanedMembers = members.map(m => m.trim()).filter(Boolean);
    const uniqueMembers = [...new Set(cleanedMembers)];

    const groupExist = await Groups.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") }
    });

    if (groupExist) {
      return res.status(400).json({ message: "Group Already Exists" });
    }

    const inviteCode = generateCode();

    const group = await Groups.create({
      name,
      currency,
      members: uniqueMembers,
      createdBy: userID,
      inviteCode,
       accessUsers: [userID]
    });

    res.status(201).json({
      message: "Group Created Successfully",
      group
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// ============================
// FETCH GROUPS
// ============================
const FetchGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Groups.find({
      $or: [
        { createdBy: userId },
        { accessUsers: userId }
      ]
    });

    res.status(200).json(groups);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ============================
// ADD NEW MEMBER
// ============================
const AddNewMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberName } = req.body;

    if (!memberName?.trim()) {
      return res.status(400).json({ message: "Member Name Required" });
    }

    const group = await Groups.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: memberName.trim() } },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "Member added successfully",
      group
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// UPDATE MEMBER
// ============================
const UpdateMemberName = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { oldName, newName } = req.body;

    if (!oldName || !newName?.trim()) {
      return res.status(400).json({ message: "Both old and new name required" });
    }

    const group = await Groups.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const index = group.members.indexOf(oldName);
    if (index === -1) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (group.members.includes(newName.trim())) {
      return res.status(400).json({ message: "Member already exists" });
    }

    group.members[index] = newName.trim();
    await group.save();

    res.status(200).json({
      message: "Member updated successfully",
      group
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// REMOVE MEMBER
// ============================
const RemoveMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberName } = req.body;

    const linkedExpense = await Expense.findOne({
      group: groupId,
      $or: [
        { paidBy: memberName },
        { "splitBetween.member": memberName }
      ]
    });

    if (linkedExpense) {
      return res.status(400).json({
        message: "Member is linked with expense entries. Remove them first."
      });
    }

    const group = await Groups.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members = group.members.filter(
      member => member !== memberName
    );

    await group.save();

    res.status(200).json({
      message: "Member removed successfully",
      group
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// JOIN GROUP USING CODE
// ============================
const JoinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const group = await Groups.findOne({ inviteCode: code });

    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (!group.accessUsers) {
      group.accessUsers = [];
    }

    if (group.accessUsers.includes(userId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    group.accessUsers.push(userId);
    await group.save();

    res.status(200).json({
      message: "Joined successfully",
      group
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  CreateGroup,
  FetchGroups,
  AddNewMember,
  RemoveMember,
  UpdateMemberName,
  JoinGroup
};
