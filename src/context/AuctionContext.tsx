import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Auction, Bid, Category, Settlement, User, ShippingStatus, AuctionStatus } from '../types/auction';
import { INITIAL_CATEGORIES } from '../data/categories';
import { SAMPLE_USERS, getSampleAuctions } from '../data/sampleData';

interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'bid';
  title: string;
  message: string;
  timestamp: string;
}

interface AuctionContextType {
  auctions: Auction[];
  bids: Bid[];
  categories: Category[];
  settlements: Settlement[];
  currentUser: User;
  currentRole: 'all' | 'buyer' | 'seller' | 'admin';
  activeTab: string;
  selectedAuctionId: string | null;
  darkMode: boolean;
  simulationActive: boolean;
  isOnboardingOpen: boolean;
  isAuthModalOpen: boolean;
  toasts: ToastNotification[];
  setActiveTab: (tab: string) => void;
  setSelectedAuctionId: (id: string | null) => void;
  setDarkMode: (dark: boolean) => void;
  setSimulationActive: (active: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setCurrentRole: (role: 'all' | 'buyer' | 'seller' | 'admin') => void;
  switchUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  placeBid: (auctionId: string, amount: number, isAutoBid?: boolean) => { success: boolean; message: string };
  setAutoBid: (auctionId: string, maxAmount: number) => { success: boolean; message: string };
  toggleWatchlist: (auctionId: string) => void;
  createAuction: (auctionData: Omit<Auction, 'id' | 'viewsCount' | 'currentBid' | 'createdAt'>) => Auction;
  updateAuction: (auctionId: string, updates: Partial<Auction>) => void;
  cancelAuction: (auctionId: string) => void;
  declareWinner: (auctionId: string) => void;
  processPayment: (settlementId: string, shippingAddress: string) => void;
  updateShipping: (settlementId: string, status: ShippingStatus, trackingNumber?: string) => void;
  addCategory: (name: string, icon: string, description: string) => void;
  deleteCategory: (categoryId: string) => void;
  deleteSettlement: (settlementId: string) => void;
  deleteAuction: (auctionId: string) => void;
  deleteBid: (bidId: string) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  completeOnboarding: (selectedRole?: 'all' | 'buyer' | 'seller' | 'admin', loadSample?: boolean, name?: string) => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'bid') => void;
  removeToast: (id: string) => void;
  getAuctionBids: (auctionId: string) => Bid[];
  getCategoryCount: (categoryName: string) => number;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Start with clean blank data in state
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_auctions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bids, setBids] = useState<Bid[]>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_bids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_settlements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_user');
      return saved ? JSON.parse(saved) : SAMPLE_USERS[0];
    } catch {
      return SAMPLE_USERS[0];
    }
  });

  const [currentRole, setCurrentRoleState] = useState<'all' | 'buyer' | 'seller' | 'admin'>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_role');
      return (saved as 'all' | 'buyer' | 'seller' | 'admin') || 'all';
    } catch {
      return 'all';
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('auctionhub_dark');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('auctionhub_onboarded_completed');
    } catch {
      return true;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('auctionhub_auctions', JSON.stringify(auctions));
  }, [auctions]);

  useEffect(() => {
    localStorage.setItem('auctionhub_bids', JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem('auctionhub_settlements', JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem('auctionhub_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('auctionhub_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('auctionhub_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem('auctionhub_dark', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  const setDarkMode = useCallback((dark: boolean) => {
    setDarkModeState(dark);
  }, []);

  const setCurrentRole = useCallback((role: 'all' | 'buyer' | 'seller' | 'admin') => {
    setCurrentRoleState(role);
    setCurrentUser(prev => ({ ...prev, role }));
  }, []);

  const addToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'bid' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeOnboarding = useCallback((selectedRole?: 'all' | 'buyer' | 'seller' | 'admin', loadSample?: boolean, name?: string) => {
    localStorage.setItem('auctionhub_onboarded_completed', 'true');
    setIsOnboardingOpen(false);

    // Merge buyer, seller, admin into unified master account
    const role: 'all' | 'buyer' | 'seller' | 'admin' = 'all';
    setCurrentRoleState(role);
    localStorage.setItem('auctionhub_role', role);

    const baseUser = SAMPLE_USERS[0];
    const updatedUser: User = {
      ...baseUser,
      name: name && name.trim().length > 0 ? name.trim() : baseUser.name,
      role: 'all',
      walletBalance: 150000
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('auctionhub_user', JSON.stringify(updatedUser));

    setActiveTab('dashboard');
    setSelectedAuctionId(null);

    if (loadSample) {
      const sample = getSampleAuctions();
      // Bind sample lots and shipments so the user has active listings to sell AND lots to bid on
      const mergedAuctions = sample.auctions.map((a, i) => {
        if (i === 0 || i === 3) {
          return {
            ...a,
            sellerId: updatedUser.id,
            sellerName: updatedUser.name
          };
        }
        return a;
      });
      const mergedSettlements = sample.settlements.map((s, i) => {
        if (i === 0) {
          return {
            ...s,
            sellerId: updatedUser.id,
            sellerName: updatedUser.name
          };
        }
        return s;
      });
      setAuctions(mergedAuctions);
      setBids(sample.bids);
      setSettlements(mergedSettlements);
      addToast('Unified Account Ready', 'Welcome! Full buyer, seller & administrator tools are enabled.', 'success');
    } else {
      // Clean slate for unified workspace
      setAuctions([]);
      setBids([]);
      setSettlements([]);
      setCurrentUser(prev => ({
        ...prev,
        watchlist: [],
        autoBids: {}
      }));
      addToast('Clean Workspace Initialized', 'Fresh unified workspace ready. You can browse, consign lots, and manage platform ops!', 'info');
    }
  }, [addToast]);

  const loadSampleData = useCallback(() => {
    const sample = getSampleAuctions();
    const sampleAuctions = sample.auctions.map((a, i) => {
      if (i === 0 || i === 3) {
        return {
          ...a,
          sellerId: currentUser.id,
          sellerName: currentUser.name
        };
      }
      return a;
    });
    const sampleSettlements = sample.settlements.map((s, i) => {
      if (i === 0) {
        return {
          ...s,
          sellerId: currentUser.id,
          sellerName: currentUser.name
        };
      }
      return s;
    });
    setAuctions(sampleAuctions);
    setBids(sample.bids);
    setSettlements(sampleSettlements);
    addToast('Sample Data Loaded', 'Populated unified lots, active bids, and order settlements successfully.', 'success');
  }, [currentUser, addToast]);

  const clearAllData = useCallback(() => {
    setAuctions([]);
    setBids([]);
    setSettlements([]);
    setCurrentUser(prev => ({
      ...prev,
      watchlist: [],
      autoBids: {}
    }));
    addToast('Data Reset', 'All auctions, bids, and settlements have been set to blank state.', 'info');
  }, [addToast]);

  const getAuctionBids = useCallback((auctionId: string): Bid[] => {
    return bids.filter(b => b.auctionId === auctionId).sort((a, b) => b.amount - a.amount);
  }, [bids]);

  const getCategoryCount = useCallback((categoryName: string): number => {
    return auctions.filter(a => a.category.toLowerCase().includes(categoryName.toLowerCase()) || categoryName.toLowerCase().includes(a.category.toLowerCase())).length;
  }, [auctions]);

  const toggleWatchlist = useCallback((auctionId: string) => {
    setCurrentUser(prev => {
      const isWatched = prev.watchlist.includes(auctionId);
      const nextWatchlist = isWatched
        ? prev.watchlist.filter(id => id !== auctionId)
        : [...prev.watchlist, auctionId];
      
      const auction = auctions.find(a => a.id === auctionId);
      if (auction) {
        addToast(
          isWatched ? 'Removed from Watchlist' : 'Added to Watchlist',
          `"${auction.title}"`,
          'info'
        );
      }
      return { ...prev, watchlist: nextWatchlist };
    });
  }, [auctions, addToast]);

  const setAutoBid = useCallback((auctionId: string, maxAmount: number) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return { success: false, message: 'Auction not found' };

    const minAllowed = auction.currentBid + auction.minIncrement;
    if (maxAmount < minAllowed) {
      return { success: false, message: `Auto-bid maximum must be at least $${minAllowed.toLocaleString()}` };
    }

    setCurrentUser(prev => ({
      ...prev,
      autoBids: {
        ...prev.autoBids,
        [auctionId]: maxAmount
      }
    }));

    addToast('Auto-Bid Configured', `Proxy ceiling set to $${maxAmount.toLocaleString()} for "${auction.title}"`, 'success');
    return { success: true, message: 'Auto-bid ceiling updated' };
  }, [auctions, addToast]);

  const placeBid = useCallback((auctionId: string, amount: number, isAutoBid = false): { success: boolean; message: string } => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return { success: false, message: 'Auction not found' };

    if (auction.status !== 'active') {
      return { success: false, message: `Cannot bid on an ${auction.status} auction.` };
    }

    const minRequired = auction.currentBid === 0 ? auction.startingPrice : auction.currentBid + auction.minIncrement;
    if (amount < minRequired) {
      return { success: false, message: `Minimum bid allowed is $${minRequired.toLocaleString()}` };
    }

    const newBidId = 'bid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newBid: Bid = {
      id: newBidId,
      auctionId,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      amount,
      timestamp: new Date().toISOString(),
      status: 'winning',
      isAutoBid
    };

    // Update previous winning bids for this auction to outbid
    setBids(prev => [
      newBid,
      ...prev.map(b => (b.auctionId === auctionId && b.status === 'winning' ? { ...b, status: 'outbid' as const } : b))
    ]);

    // Update auction current bid and winner
    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentBid: amount,
          winnerId: currentUser.id,
          winnerName: currentUser.name,
          viewsCount: a.viewsCount + 1
        };
      }
      return a;
    }));

    addToast(
      'Bid Placed Successfully!',
      `You are the highest bidder for "${auction.title}" at $${amount.toLocaleString()}`,
      'bid'
    );

    return { success: true, message: 'Bid placed successfully' };
  }, [auctions, currentUser, addToast]);

  const createAuction = useCallback((auctionData: Omit<Auction, 'id' | 'viewsCount' | 'currentBid' | 'createdAt'>): Auction => {
    const id = 'auc-' + Date.now();
    const newAuction: Auction = {
      ...auctionData,
      id,
      currentBid: auctionData.startingPrice,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };

    setAuctions(prev => [newAuction, ...prev]);
    addToast('Auction Created', `"${newAuction.title}" has been created as ${newAuction.status}.`, 'success');
    return newAuction;
  }, [addToast]);

  const updateAuction = useCallback((auctionId: string, updates: Partial<Auction>) => {
    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, ...updates } : a));
    addToast('Auction Updated', 'Changes saved successfully.', 'info');
  }, [addToast]);

  const cancelAuction = useCallback((auctionId: string) => {
    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, status: 'cancelled' as AuctionStatus } : a));
    addToast('Auction Cancelled', 'Auction lot marked as cancelled.', 'warning');
  }, [addToast]);

  const declareWinner = useCallback((auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return;

    const auctionBids = bids.filter(b => b.auctionId === auctionId).sort((a, b) => b.amount - a.amount);
    const highestBid = auctionBids[0];

    const finalStatus: AuctionStatus = highestBid ? 'sold' : 'closed';
    const winnerId = highestBid ? highestBid.bidderId : undefined;
    const winnerName = highestBid ? highestBid.bidderName : undefined;

    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId) {
        return {
          ...a,
          status: finalStatus,
          winnerId,
          winnerName
        };
      }
      return a;
    }));

    // Update winning bids
    if (highestBid) {
      setBids(prev => prev.map(b => {
        if (b.id === highestBid.id) {
          return { ...b, status: 'won' as const };
        }
        if (b.auctionId === auctionId) {
          return { ...b, status: 'lost' as const };
        }
        return b;
      }));

      // Create settlement entry
      const newSettlement: Settlement = {
        id: 'settle-' + Date.now(),
        auctionId: auction.id,
        auctionTitle: auction.title,
        auctionImage: auction.images[0] || '',
        buyerId: highestBid.bidderId,
        buyerName: highestBid.bidderName,
        sellerId: auction.sellerId,
        sellerName: auction.sellerName,
        amount: highestBid.amount,
        paymentStatus: 'pending',
        shippingStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      setSettlements(prev => [newSettlement, ...prev]);
      addToast(
        'Auction Finalized',
        `Winner declared: ${highestBid.bidderName} won "${auction.title}" for $${highestBid.amount.toLocaleString()}`,
        'success'
      );
    } else {
      addToast('Auction Closed', `"${auction.title}" closed without any bids.`, 'info');
    }
  }, [auctions, bids, addToast]);

  const processPayment = useCallback((settlementId: string, shippingAddress: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          paymentStatus: 'completed' as const,
          shippingStatus: 'processing' as const,
          shippingAddress,
          paidAt: new Date().toISOString()
        };
      }
      return s;
    }));

    addToast('Payment Successful', 'Payment captured via Escrow. Seller has been notified to prepare shipment.', 'success');
  }, [addToast]);

  const updateShipping = useCallback((settlementId: string, status: ShippingStatus, trackingNumber?: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          shippingStatus: status,
          trackingNumber: trackingNumber || s.trackingNumber,
          carrier: s.carrier || 'Global Express Courier'
        };
      }
      return s;
    }));

    addToast('Delivery Status Updated', `Order status changed to ${status.toUpperCase()}.`, 'info');
  }, [addToast]);

  const addCategory = useCallback((name: string, icon: string, description: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug,
      icon,
      description
    };
    setCategories(prev => [...prev, newCategory]);
    addToast('Category Added', `Category "${name}" created successfully.`, 'success');
  }, [addToast]);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    addToast('Category Deleted', 'Category removed from platform taxonomy.', 'info');
  }, [addToast]);

  const deleteSettlement = useCallback((settlementId: string) => {
    setSettlements(prev => prev.filter(s => s.id !== settlementId));
    addToast('Invoice Deleted', `Settlement invoice #${settlementId} removed from records.`, 'info');
  }, [addToast]);

  const deleteAuction = useCallback((auctionId: string) => {
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
    setBids(prev => prev.filter(b => b.auctionId !== auctionId));
    setSettlements(prev => prev.filter(s => s.auctionId !== auctionId));
    addToast('Auction Deleted', `Auction lot #${auctionId} and associated records removed.`, 'info');
  }, [addToast]);

  const deleteBid = useCallback((bidId: string) => {
    setBids(prev => prev.filter(b => b.id !== bidId));
    addToast('Bid Removed', `Bid record #${bidId} deleted from transaction ledger.`, 'info');
  }, [addToast]);

  const switchUser = useCallback((user: User) => {
    setCurrentUser(user);
    setCurrentRoleState(user.role);
    addToast('Persona Switched', `Logged in as ${user.name} (${user.role.toUpperCase()})`, 'info');
  }, [addToast]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    addToast('Profile Updated', 'User profile information updated.', 'info');
  }, [addToast]);

  // Real-time Bidding Simulator
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Find active auctions
      const activeAuctions = auctions.filter(a => a.status === 'active');
      if (activeAuctions.length === 0) return;

      // Pick a random auction
      const target = activeAuctions[Math.floor(Math.random() * activeAuctions.length)];
      const botNames = ['Julian Hayes', 'ApexBidder99', 'HorologyKnight', 'VeloxCollector', 'SothebyLover', 'VintageWhisperer'];
      const botName = botNames[Math.floor(Math.random() * botNames.length)];
      const botId = 'bot-' + botName.toLowerCase().replace(/\s+/g, '-');

      // Next bid amount
      const nextAmount = target.currentBid + target.minIncrement;

      // Place bot bid
      const newBidId = 'bid-sim-' + Date.now();
      const newBid: Bid = {
        id: newBidId,
        auctionId: target.id,
        bidderId: botId,
        bidderName: botName,
        amount: nextAmount,
        timestamp: new Date().toISOString(),
        status: 'winning'
      };

      setBids(prev => [
        newBid,
        ...prev.map(b => (b.auctionId === target.id && b.status === 'winning' ? { ...b, status: 'outbid' as const } : b))
      ]);

      setAuctions(prev => prev.map(a => {
        if (a.id === target.id) {
          return {
            ...a,
            currentBid: nextAmount,
            winnerId: botId,
            winnerName: botName,
            viewsCount: a.viewsCount + 1
          };
        }
        return a;
      }));

      // Check if current user had auto-bid on this item
      if (currentUser.autoBids && currentUser.autoBids[target.id]) {
        const userMax = currentUser.autoBids[target.id];
        if (userMax >= nextAmount + target.minIncrement) {
          // Counter-bid automatically!
          setTimeout(() => {
            const counterAmount = nextAmount + target.minIncrement;
            const autoBidId = 'bid-auto-' + Date.now();
            const counterBid: Bid = {
              id: autoBidId,
              auctionId: target.id,
              bidderId: currentUser.id,
              bidderName: currentUser.name,
              amount: counterAmount,
              timestamp: new Date().toISOString(),
              status: 'winning',
              isAutoBid: true
            };

            setBids(prevBids => [
              counterBid,
              ...prevBids.map(b => (b.auctionId === target.id && b.status === 'winning' ? { ...b, status: 'outbid' as const } : b))
            ]);

            setAuctions(prevAuc => prevAuc.map(a => {
              if (a.id === target.id) {
                return {
                  ...a,
                  currentBid: counterAmount,
                  winnerId: currentUser.id,
                  winnerName: currentUser.name
                };
              }
              return a;
            }));

            addToast(
              'Auto-Bid Triggered!',
              `Your proxy bid counter-bid at $${counterAmount.toLocaleString()} for "${target.title}"`,
              'bid'
            );
          }, 1200);
          return;
        }
      }

      // If current user was previously winning, show outbid alert
      if (target.winnerId === currentUser.id) {
        addToast(
          'You Have Been Outbid!',
          `${botName} placed a bid of $${nextAmount.toLocaleString()} on "${target.title}".`,
          'warning'
        );
      } else {
        addToast(
          'New Live Bid',
          `${botName} bid $${nextAmount.toLocaleString()} on "${target.title}".`,
          'bid'
        );
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [simulationActive, auctions, currentUser, addToast]);

  // Periodic auction expiration checker: if an active auction's endTime is past, declare winner
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      auctions.forEach(a => {
        if (a.status === 'active' && new Date(a.endTime).getTime() <= now) {
          declareWinner(a.id);
        } else if (a.status === 'upcoming' && new Date(a.startTime).getTime() <= now) {
          setAuctions(prev => prev.map(item => item.id === a.id ? { ...item, status: 'active' as AuctionStatus } : item));
          addToast('Auction Started', `"${a.title}" is now open for live bidding!`, 'info');
        }
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [auctions, declareWinner, addToast]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        bids,
        categories,
        settlements,
        currentUser,
        currentRole,
        activeTab,
        selectedAuctionId,
        darkMode,
        simulationActive,
        isOnboardingOpen,
        isAuthModalOpen,
        toasts,
        setActiveTab,
        setSelectedAuctionId,
        setDarkMode,
        setSimulationActive,
        setIsOnboardingOpen,
        setIsAuthModalOpen,
        setCurrentRole,
        switchUser,
        updateUser,
        placeBid,
        setAutoBid,
        toggleWatchlist,
        createAuction,
        updateAuction,
        cancelAuction,
        declareWinner,
        processPayment,
        updateShipping,
        addCategory,
        deleteCategory,
        deleteSettlement,
        deleteAuction,
        deleteBid,
        loadSampleData,
        clearAllData,
        completeOnboarding,
        addToast,
        removeToast,
        getAuctionBids,
        getCategoryCount,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
