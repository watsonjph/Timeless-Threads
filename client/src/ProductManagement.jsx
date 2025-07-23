import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiGrid, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { productsAPI } from './api/apiService';
import { suppliersAPI } from './api/apiService';

export default function ProductManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [addVariantLoading, setAddVariantLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState('');
  const [showEditInventoryModal, setShowEditInventoryModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [editInventoryForm, setEditInventoryForm] = useState(null);
  const [editInventoryLoading, setEditInventoryLoading] = useState(false);
  const [editInventoryError, setEditInventoryError] = useState('');
  const [editInventorySuccess, setEditInventorySuccess] = useState('');
  const [deleteInventoryLoading, setDeleteInventoryLoading] = useState(false);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const tabs = [
    { id: 'products', label: 'Products', icon: <FiBox className="text-xl" /> },
    { id: 'inventory', label: 'Product Inventory', icon: <FiGrid className="text-xl" /> },
  ];

  useEffect(() => {
    // Admin-only access
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'inventory') {
      fetchInventory();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchProducts = () => {
    setLoading(true);
    setError('');
    productsAPI.getAll()
      .then(res => setProducts(res.data.products || []))
      .catch(() => setError('Failed to fetch products.'))
      .finally(() => setLoading(false));
  };

  const fetchInventory = () => {
    setInventoryLoading(true);
    setInventoryError('');
    productsAPI.getInventory()
      .then(res => setInventory(res.data.inventory || []))
      .catch(() => setInventoryError('Failed to fetch inventory.'))
      .finally(() => setInventoryLoading(false));
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setEditForm({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      price: product.price,
      is_active: product.is_active ? 'true' : 'false',
      supplier_id: product.supplier_id,
      variants: product.variants.map(v => ({
        ...v,
        is_active: v.is_active ? 'true' : 'false',
      })),
    });
    setShowEditModal(true);
    // Fetch categories for dropdown
    try {
      const res = await productsAPI.getCategories();
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    }
    // Fetch suppliers for dropdown
    try {
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers || []);
    } catch {
      setSuppliers([]);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(f => ({ ...f, [field]: value }));
  };

  const handleVariantChange = (idx, field, value) => {
    setEditForm(f => ({
      ...f,
      variants: f.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v)
    }));
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditForm(null);
  };

  const handleRemoveVariant = (variant_id) => {
    setEditForm(f => ({
      ...f,
      variants: f.variants.filter(v => v.variant_id !== variant_id),
      _deletedVariants: [...(f._deletedVariants || []), variant_id],
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      // Split variants into existing and new
      const existingVariants = editForm.variants.filter(v => Number(v.variant_id) > 0);
      const newVariants = editForm.variants.filter(v => Number(v.variant_id) <= 0);
      // Update product and existing variants
      await productsAPI.update(editForm.product_id, {
        name: editForm.name,
        description: editForm.description,
        category_id: editForm.category_id,
        price: editForm.price,
        is_active: editForm.is_active === 'true',
        supplier_id: editForm.supplier_id,
        variants: existingVariants.map(v => ({
          ...v,
          is_active: v.is_active === 'true',
        })),
      });
      // Add new variants
      for (const v of newVariants) {
        await productsAPI.addVariant(editForm.product_id, {
          size: v.size,
          color: v.color,
          sku: v.sku,
          is_active: v.is_active === 'true',
        });
      }
      // Delete removed variants
      if (editForm._deletedVariants) {
        for (const variant_id of editForm._deletedVariants) {
          if (Number(variant_id) > 0) {
            await productsAPI.deleteVariant(variant_id);
          }
        }
      }
      setSaveSuccess('Product updated successfully!');
      fetchProducts();
      setTimeout(() => {
        setShowEditModal(false);
        setEditingProduct(null);
        setEditForm(null);
        setSaveSuccess('');
      }, 1200);
    } catch (err) {
      setSaveError('Failed to update product.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddVariant = () => {
    setEditForm(f => {
      const minId = f.variants.length > 0 ? Math.min(...f.variants.map(v => Number(v.variant_id) || 0)) : 0;
      const tempId = minId > 0 ? -1 : minId - 1;
      return {
        ...f,
        variants: [
          ...f.variants,
          {
            variant_id: tempId,
            size: '',
            color: '',
            sku: '',
            is_active: 'true',
          },
        ],
      };
    });
  };

  const handleOpenAddModal = async () => {
    setAddForm({
      name: '',
      description: '',
      category_id: '',
      price: '',
      is_active: 'true',
      supplier_id: '',
    });
    setShowAddModal(true);
    // Fetch categories and suppliers for dropdowns
    try {
      const res = await productsAPI.getCategories();
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    }
    try {
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers || []);
    } catch {
      setSuppliers([]);
    }
  };

  const handleAddFormChange = (field, value) => {
    setAddForm(f => ({ ...f, [field]: value }));
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    setAddSuccess('');
    try {
      await productsAPI.create({
        name: addForm.name,
        description: addForm.description,
        category_id: addForm.category_id,
        price: addForm.price,
        is_active: addForm.is_active === 'true',
        supplier_id: addForm.supplier_id,
      });
      setAddSuccess('Product added successfully!');
      fetchProducts();
      setTimeout(() => {
        setShowAddModal(false);
        setAddForm(null);
        setAddSuccess('');
      }, 1200);
    } catch (err) {
      setAddError('Failed to add product.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddForm(null);
    setAddError('');
    setAddSuccess('');
  };

  const handleEditInventory = (entry) => {
    setEditingInventory(entry);
    setEditInventoryForm({
      pd_inventory_id: entry.pd_inventory_id,
      stock_quantity: entry.stock_quantity,
      restock_threshold: entry.restock_threshold,
      last_restocked: entry.last_restocked ? entry.last_restocked.slice(0, 19) : '',
    });
    setShowEditInventoryModal(true);
    setEditInventoryError('');
    setEditInventorySuccess('');
  };

  const handleEditInventoryFormChange = (field, value) => {
    setEditInventoryForm(f => ({ ...f, [field]: value }));
  };

  const handleSaveEditInventory = async (e) => {
    e.preventDefault();
    setEditInventoryLoading(true);
    setEditInventoryError('');
    setEditInventorySuccess('');
    try {
      await productsAPI.updateInventory(editInventoryForm.pd_inventory_id, {
        stock_quantity: editInventoryForm.stock_quantity,
        restock_threshold: editInventoryForm.restock_threshold,
        last_restocked: editInventoryForm.last_restocked || null,
      });
      setEditInventorySuccess('Inventory updated successfully!');
      fetchInventory();
      setTimeout(() => {
        setShowEditInventoryModal(false);
        setEditingInventory(null);
        setEditInventoryForm(null);
        setEditInventorySuccess('');
      }, 1200);
    } catch (err) {
      setEditInventoryError('Failed to update inventory.');
    } finally {
      setEditInventoryLoading(false);
    }
  };

  const handleCloseEditInventoryModal = () => {
    setShowEditInventoryModal(false);
    setEditingInventory(null);
    setEditInventoryForm(null);
    setEditInventoryError('');
    setEditInventorySuccess('');
  };

  const handleDeleteInventory = async (pd_inventory_id) => {
    if (!window.confirm('Delete this inventory entry?')) return;
    setDeleteInventoryLoading(true);
    try {
      await productsAPI.deleteInventory(pd_inventory_id);
      fetchInventory();
    } catch {
      // Optionally show error
    } finally {
      setDeleteInventoryLoading(false);
    }
  };

  const handleDeleteProduct = async (product_id) => {
    if (!window.confirm('Delete this product and all its variants and inventory entries?')) return;
    setDeleteProductLoading(product_id);
    try {
      await productsAPI.delete(product_id);
      fetchProducts();
    } catch {
      // Optionally show error
    } finally {
      setDeleteProductLoading(false);
    }
  };

  const renderProductsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product.product_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{product.product_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={product.description}>{product.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.category_name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.is_active ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.supplier_name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600"
                  title="Edit Product"
                  onClick={() => handleEditProduct(product)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-600"
                  title="Delete Product"
                  onClick={() => handleDeleteProduct(product.product_id)}
                  disabled={deleteProductLoading === product.product_id}
                >
                  {deleteProductLoading === product.product_id ? '...' : <FiTrash2 />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInventoryTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restock Threshold</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map(item => (
            <tr key={item.pd_inventory_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{item.pd_inventory_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.variant_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.product_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.stock_quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.restock_threshold}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.last_restocked ? new Date(item.last_restocked).toLocaleString() : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600"
                  title="Edit Inventory"
                  onClick={() => handleEditInventory(item)}
                >
                  <FiEdit2 />
                </button>
                <button
                  className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-600"
                  title="Delete Inventory"
                  onClick={() => handleDeleteInventory(item.pd_inventory_id)}
                  disabled={deleteInventoryLoading}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEditModal = () => (
    showEditModal && editForm && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-5xl w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-custom-dark">Edit Product</h2>
            <button
              onClick={handleCloseEditModal}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Product ID</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  value={editForm.product_id}
                  disabled
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.name}
                  onChange={e => handleEditFormChange('name', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-custom-dark font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.description}
                  onChange={e => handleEditFormChange('description', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.category_id}
                  onChange={e => handleEditFormChange('category_id', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Price</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.price}
                  onChange={e => handleEditFormChange('price', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Is Active</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.is_active}
                  onChange={e => handleEditFormChange('is_active', e.target.value)}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Supplier</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={editForm.supplier_id}
                  onChange={e => handleEditFormChange('supplier_id', e.target.value)}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(sup => (
                    <option key={sup.supplier_id} value={sup.supplier_id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Variants Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-custom-dark">Variants</h3>
                <button
                  type="button"
                  className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                  onClick={handleAddVariant}
                >
                  Add Variant
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editForm.variants.map((variant, idx) => (
                      <tr key={variant.variant_id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            value={Number(variant.variant_id) > 0 ? variant.variant_id : 'new'}
                            disabled
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                            value={variant.size || ''}
                            onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                            value={variant.color || ''}
                            onChange={e => handleVariantChange(idx, 'color', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                            value={variant.sku || ''}
                            onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <select
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                            value={variant.is_active}
                            onChange={e => handleVariantChange(idx, 'is_active', e.target.value)}
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            title="Delete Variant"
                            onClick={() => handleRemoveVariant(variant.variant_id)}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {saveError && <div className="text-red-500 text-sm mt-2">{saveError}</div>}
            {saveSuccess && <div className="text-green-600 text-sm mt-2">{saveSuccess}</div>}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const renderAddModal = () => (
    showAddModal && addForm && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-4xl w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-custom-dark">Add Product</h2>
            <button
              onClick={handleCloseAddModal}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleSaveAdd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.name}
                  onChange={e => handleAddFormChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-custom-dark font-medium mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.description}
                  onChange={e => handleAddFormChange('description', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.category_id}
                  onChange={e => handleAddFormChange('category_id', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Price</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.price}
                  onChange={e => handleAddFormChange('price', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Is Active</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.is_active}
                  onChange={e => handleAddFormChange('is_active', e.target.value)}
                  required
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Supplier</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={addForm.supplier_id}
                  onChange={e => handleAddFormChange('supplier_id', e.target.value)}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(sup => (
                    <option key={sup.supplier_id} value={sup.supplier_id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {addError && <div className="text-red-500 text-sm mt-2">{addError}</div>}
            {addSuccess && <div className="text-green-600 text-sm mt-2">{addSuccess}</div>}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                disabled={addLoading}
              >
                {addLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const renderEditInventoryModal = () => (
    showEditInventoryModal && editInventoryForm && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-custom-dark">Edit Inventory</h2>
            <button
              onClick={handleCloseEditInventoryModal}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleSaveEditInventory}>
            <div>
              <label className="block text-custom-dark font-medium mb-2">Inventory ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                value={editInventoryForm.pd_inventory_id}
                disabled
              />
            </div>
            <div>
              <label className="block text-custom-dark font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={editInventoryForm.stock_quantity}
                onChange={e => handleEditInventoryFormChange('stock_quantity', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-custom-dark font-medium mb-2">Restock Threshold</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={editInventoryForm.restock_threshold}
                onChange={e => handleEditInventoryFormChange('restock_threshold', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-custom-dark font-medium mb-2">Last Restocked</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={editInventoryForm.last_restocked}
                onChange={e => handleEditInventoryFormChange('last_restocked', e.target.value)}
              />
            </div>
            {editInventoryError && <div className="text-red-500 text-sm mt-2">{editInventoryError}</div>}
            {editInventorySuccess && <div className="text-green-600 text-sm mt-2">{editInventorySuccess}</div>}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseEditInventoryModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                disabled={editInventoryLoading}
              >
                {editInventoryLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const renderContent = () => {
    if (activeTab === 'products') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-end mb-6 gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-poppins cursor-pointer"
              onClick={handleOpenAddModal}
            >
              Add Product
            </button>
            <button
              className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
              onClick={fetchProducts}
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            renderProductsTable()
          )}
          {renderAddModal()}
          {renderEditModal()}
        </div>
      );
    }
    if (activeTab === 'inventory') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-end mb-6 gap-2">
            <button
              className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
              onClick={fetchInventory}
            >
              Refresh
            </button>
          </div>
          {inventoryLoading ? (
            <div className="text-center py-8 text-gray-500">Loading inventory...</div>
          ) : inventoryError ? (
            <div className="text-center py-8 text-red-500">{inventoryError}</div>
          ) : (
            renderInventoryTable()
          )}
          {renderEditInventoryModal()}
        </div>
      );
    }
    return null;
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-custom-dark mb-8">Product Management</h1>
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-white rounded-xl shadow-md p-2 mb-6 max-w-2xl w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors duration-200 ${activeTab === tab.id ? 'bg-custom-dark text-custom-cream' : 'text-custom-dark hover:bg-gray-100'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>
      {renderContent()}
    </main>
  );
} 