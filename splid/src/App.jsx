import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import { BrowserRouter, Navigate, Router, Link, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import CreateNewGroup from './pages/CreateNewGroup'
import Groups from './pages/Groups'
import {GroupProvider} from './context/GroupContext'
import AddExpense from './pages/AddExpense'
import ExpenseHistory from './pages/ExpenseHistory'
import MakePayment from './pages/MakePayment'
import SettleUp from './pages/SettleUp'
import ForgotPassword from './pages/ForgotPassword'
import JoinGroup from './pages/JoinGroup'
import ResetPassword from './pages/ResetPassword'
function App() {


  return (
    <>
      <GroupProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/createnewgroup' element={<CreateNewGroup></CreateNewGroup>}></Route>
            <Route path='/groups' element={<Groups></Groups>}></Route>
            <Route path='/addexpense' element={<AddExpense></AddExpense>}></Route>
            <Route path='/expensehistory' element={<ExpenseHistory></ExpenseHistory>}></Route>
            <Route path='/makepayment' element={<MakePayment></MakePayment>}></Route>
            <Route path='/settleup' element={<SettleUp></SettleUp>}></Route>
            <Route path='/join-group' element={<JoinGroup></JoinGroup>}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>

      </GroupProvider>
    </>
  )
}

export default App
