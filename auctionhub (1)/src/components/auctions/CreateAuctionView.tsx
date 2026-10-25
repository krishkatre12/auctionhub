import React, { useState, useRef } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { ItemCondition, AuctionStatus } from '../../types/auction';
import { formatCurrency } from '../../utils/formatters';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  Plus, 
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export const CreateAuctionView: React.FC = () => {
  const { categories, currentUser, createAuction, setSelectedAuctionId, setActiveTab, addToast } = useAuction();

  const [step, setStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Vehicles');
  const [condition, setCondition] = useState<ItemCondition>('Excellent');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('New York, NY');

  // Media
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&h=800&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Pricing & Duration
  const [startingPrice, setStartingPrice] = useState<number>(1000);
  const [hasReserve, setHasReserve] = useState<boolean>(false);
  const [reservePrice, setReservePrice] = useState<number>(1500);
  const [minIncrement, setMinIncrement] = useState<number>(50);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [startDelayHours, setStartDelayHours] = useState<number>(0);

  // Quick Preset Images for testing
  const presets = [
    { label: 'Shelby GT500', url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&h=800&q=80' },
    { label: 'Rolex Daytona', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=800&q=80' },
    { label: 'Modern Canvas Art', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&h=800&q=80' },
    { label: 'Vintage Teak Wood', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&h=800&q=80' },
    { label: 'Hi-Fi Audio Tube Amp', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&h=800&q=80' }
  ];

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      addToast('Input Required', 'Please enter a valid image URL.', 'warning');
      return;
    }
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    addToast('Photo Added', 'New image URL added to your auction gallery.', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
          addToast('Image Uploaded', `Uploaded "${file.name}" from your device.`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      addToast('Validation', 'Auction must have at least one photo.', 'warning');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
    addToast('Photo Removed', 'Image removed from gallery.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      addToast('Validation Error', 'Please complete the title and description.', 'warning');
      setStep(1);
      return;
    }

    const now = new Date();
    const startTime = isScheduled && startDelayHours > 0
      ? new Date(now.getTime() + startDelayHours * 3600 * 1000).toISOString()
      : now.toISOString();

    const endTime = new Date(
      (isScheduled && startDelayHours > 0 ? now.getTime() + startDelayHours * 3600 * 1000 : now.getTime()) +
      durationHours * 3600 * 1000
    ).toISOString();

    const status: AuctionStatus = isScheduled && startDelayHours > 0 ? 'upcoming' : 'active';

    const newAuction = createAuction({
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      images,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      startingPrice,
      reservePrice: hasReserve ? reservePrice : undefined,
      minIncrement,
      startTime,
      endTime,
      status,
      location,
      featured: true
    });

    setSelectedAuctionId(newAuction.id);
    setActiveTab('detail');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create New Auction Lot
          </h1>
          <p className="text-xs text-slate-500">
            List your item with starting prices, increments, and scheduled duration.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('explore')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Multi-Step Indicator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[
            { num: 1, label: 'Particulars' },
            { num: 2, label: 'Photos & Media' },
            { num: 3, label: 'Pricing & Time' },
            { num: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === s.num
                    ? 'bg-violet-600 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === s.num ? 'text-violet-700 dark:text-violet-300 font-bold' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xs">
        
        {/* Step 1: Particulars */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 1: Item Particulars & Classification
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auction Lot Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1967 Shelby GT500 Fastback in Wimbledon White"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Vintage/Antique">Vintage / Antique</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Item Origin / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Monterey, CA or London, UK"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Comprehensive Lot Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed provenance, serial numbers, mechanical history, included certificates of authenticity, and physical dimensions..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>
          </div>
        )}

        {/* Step 2: Photography & Media (Fixed & Fully Functional Upload) */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: Lot Photography & Media
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload image files from your computer or phone, paste an image URL, or pick from curated lot presets.
              </p>
            </div>

            {/* Upload Box / Dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-700 hover:border-violet-500 bg-violet-50/40 dark:bg-violet-950/20 text-center cursor-pointer transition-colors space-y-2 group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-violet-900 dark:text-violet-200">
                  Click to Browse & Upload Photos from Device
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports PNG, JPG, WEBP, and high-res photography. Multiple files supported.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick URL Input with Enter key handler */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or Add Photo via Direct Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="p-3.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 space-y-2">
              <span className="text-[11px] font-bold text-violet-900 dark:text-violet-300 uppercase block">
                Quick Preset Photos (Click to append)
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setImages(prev => [...prev, p.url]);
                      addToast('Preset Photo Added', `Added "${p.label}" to gallery.`, 'success');
                    }}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-800 text-slate-700 dark:text-slate-200 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Images Gallery Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Current Lot Gallery ({images.length} photo{images.length > 1 ? 's' : ''})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group bg-slate-100">
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-900/80 text-white font-mono">
                      {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Timing */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 3: Pricing, Minimum Increments & Duration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Starting Price ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    min="1"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Bid Increment ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    min="1"
                    value={minIncrement}
                    onChange={(e) => setMinIncrement(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>
              </div>
            </div>

            {/* Reserve Price Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Confidential Reserve Price</h4>
                  <p className="text-[11px] text-slate-500">Item will not sell unless bids reach or exceed this threshold.</p>
                </div>
                <input
                  type="checkbox"
                  checked={hasReserve}
                  onChange={(e) => setHasReserve(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {hasReserve && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reserve Price Amount ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      min={startingPrice}
                      value={reservePrice}
                      onChange={(e) => setReservePrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Auction Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { hours: 1, label: '1 Hour (Speed)' },
                  { hours: 12, label: '12 Hours' },
                  { hours: 24, label: '24 Hours (1 Day)' },
                  { hours: 72, label: '3 Days' },
                ].map((d) => (
                  <button
                    key={d.hours}
                    type="button"
                    onClick={() => setDurationHours(d.hours)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      durationHours === d.hours
                        ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduled Start Date Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Schedule for Upcoming Launch</h4>
                  <p className="text-[11px] text-slate-500">Set item as &apos;Upcoming&apos; before accepting bids.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 cursor-pointer"
                />
              </div>

              {isScheduled && (
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start in (Hours from now)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startDelayHours}
                    onChange={(e) => setStartDelayHours(parseInt(e.target.value) || 1)}
                    className="w-32 px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

          </div>
        )}

        {/* Step 4: Review (Color Scheme strictly matching Purple & Light Purple Theme) */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 4: Review Summary & Publish Lot
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify lot particulars, pricing, and timing before activating on the live marketplace.
              </p>
            </div>

            {/* Harmonized Purple Review Card */}
            <div className="p-5 rounded-2xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50/80 dark:bg-violet-950/40 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={images[0]}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-32 h-32 rounded-xl object-cover bg-violet-100 dark:bg-violet-900 border border-violet-200 dark:border-violet-800 shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-violet-200 text-violet-900 dark:bg-violet-800 dark:text-violet-100">
                      {category}
                    </span>
                    <span className="text-[11px] text-violet-700 dark:text-violet-300 font-semibold">
                      Condition: {condition}
                    </span>
                  </div>
                  
                  <h4 className="text-base font-bold text-violet-950 dark:text-white line-clamp-1">
                    {title || 'Untitled Auction Lot'}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-violet-800 dark:text-violet-300 font-medium pt-1">
                    <MapPin className="w-3.5 h-3.5 text-violet-600" />
                    <span>Origin: {location}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Scheduling Summary Strip in Matching Purple Theme */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-violet-200 dark:border-violet-800/80 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 block">Starting Price</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(startingPrice)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 block">Min Increment</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(minIncrement)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 block">Reserve Price</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {hasReserve ? formatCurrency(reservePrice) : 'None'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 block">Initial Status</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300 text-sm">
                    {isScheduled && startDelayHours > 0 ? 'Upcoming' : 'Active (Live)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cohesive Purple Launch Banner */}
            <div className="p-4 rounded-xl bg-violet-100/70 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-700 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-700 dark:text-violet-300 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-violet-950 dark:text-violet-100">
                  Ready to Publish on AuctionHub
                </h5>
                <p className="text-[11px] text-violet-800 dark:text-violet-300 mt-0.5 leading-relaxed">
                  Your listing has been validated with all photo galleries and pricing parameters. Click below to launch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  addToast('Required Field', 'Please provide an auction title.', 'warning');
                  return;
                }
                setStep(step + 1);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm"
            >
              Publish Auction Lot
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
