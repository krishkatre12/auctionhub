import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { 
  FolderTree, 
  Plus, 
  Trash2, 
  Tag, 
  ArrowRight, 
  X,
  Car,
  Palette,
  Cpu,
  Hourglass,
  Gem,
  Building2,
  Trophy,
  Layers
} from 'lucide-react';

export const CategoryManagementView: React.FC = () => {
  const { categories, auctions, addCategory, deleteCategory, setActiveTab, getCategoryCount } = useAuction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [deleteTarget, setDeleteTarget] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatIcon, newCatDesc.trim());
    setNewCatName('');
    setNewCatDesc('');
    setIsModalOpen(false);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-5 h-5 text-violet-600" />;
      case 'Palette': return <Palette className="w-5 h-5 text-violet-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-600" />;
      case 'Hourglass': return <Hourglass className="w-5 h-5 text-violet-600" />;
      case 'Gem': return <Gem className="w-5 h-5 text-violet-600" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-violet-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-violet-600" />;
      default: return <Tag className="w-5 h-5 text-violet-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="text-xs text-slate-500">
            Define, organize, and inspect catalog taxonomy across the marketplace.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.name);
          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center">
                  {getIconComponent(cat.icon)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {count} lots
                  </span>
                  {categories.length > 3 && (
                    <button
                      onClick={() => setDeleteTarget({ isOpen: true, id: cat.id, name: cat.name })}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded-md"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {cat.description || 'General category for auction lots.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                >
                  Browse Items <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Rare Books & Manuscripts"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Icon Emblem
                </label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="Tag">Generic Tag</option>
                  <option value="Car">Vehicles / Automobile</option>
                  <option value="Palette">Art / Design</option>
                  <option value="Gem">Jewelry / Horology</option>
                  <option value="Cpu">Electronics / Computing</option>
                  <option value="Hourglass">Antiques / Vintage</option>
                  <option value="Building2">Real Estate / Architecture</option>
                  <option value="Trophy">Collectibles / Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief summary of items eligible for this category..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget.isOpen}
        title="Delete Taxonomy Category"
        itemName={deleteTarget.name}
        itemType="catalog category"
        onConfirm={() => {
          deleteCategory(deleteTarget.id);
          setDeleteTarget({ isOpen: false, id: '', name: '' });
        }}
        onCancel={() => setDeleteTarget({ isOpen: false, id: '', name: '' })}
      />

    </div>
  );
};
