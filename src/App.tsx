/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AuctionListView } from './components/auctions/AuctionListView';
import { AuctionDetailView } from './components/auctions/AuctionDetailView';
import { CreateAuctionView } from './components/auctions/CreateAuctionView';
import { UserDashboardView } from './components/user/UserDashboardView';
import { SettlementView } from './components/settlement/SettlementView';
import { CategoryManagementView } from './components/categories/CategoryManagementView';
import { ReportsView } from './components/reports/ReportsView';
import { BidderPortalView } from './components/portals/BidderPortalView';
import { SellerPortalView } from './components/portals/SellerPortalView';
import { AdminPortalView } from './components/portals/AdminPortalView';
import { LoginView } from './components/auth/LoginView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

function MainLayout() {
  const { activeTab, darkMode } = useAuction();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`h-screen h-[100dvh] flex flex-col font-sans overflow-hidden transition-colors ${
      darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar: Sticky/Pinned at the top, never disappears on scroll */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Body Layout: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'bidder-portal' && <BidderPortalView />}
          {activeTab === 'seller-portal' && <SellerPortalView />}
          {activeTab === 'admin-portal' && <AdminPortalView />}
          {activeTab === 'explore' && <AuctionListView />}
          {activeTab === 'detail' && <AuctionDetailView />}
          {activeTab === 'create' && <CreateAuctionView />}
          {activeTab === 'my-bids' && <UserDashboardView />}
          {activeTab === 'settlement' && <SettlementView />}
          {activeTab === 'categories' && <CategoryManagementView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'login' && <LoginView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <OnboardingModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuctionProvider>
      <MainLayout />
    </AuctionProvider>
  );
}
