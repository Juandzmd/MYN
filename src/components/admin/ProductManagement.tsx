import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Edit2, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    category: string | null;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            showToast(`❌ Error al cargar productos: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            showToast(`❌ Error al subir imagen: ${error.message}`);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let finalImageUrl = imageUrl;
        let finalMediaUrls = [...mediaUrls];

        try {
            // Upload main image if selected
            if (imageFile) {
                const uploadedUrl = await handleImageUpload(imageFile);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
            }

            // Upload additional media files
            if (mediaFiles.length > 0) {
                const uploadPromises = mediaFiles.map(file => handleImageUpload(file));
                const uploadedUrls = await Promise.all(uploadPromises);
                const validUrls = uploadedUrls.filter((url): url is string => url !== null);
                finalMediaUrls = [...finalMediaUrls, ...validUrls];
            }

            const productData = {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category,
                image_url: finalImageUrl,
                media_urls: finalMediaUrls
            };

            if (editingProduct) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
                showToast('✅ Producto actualizado correctamente');
            } else {
                // Create new product
                const { error } = await supabase
                    .from('products')
                    .insert(productData);

                if (error) throw error;
                showToast('✅ Producto creado correctamente');
            }

            closeModal();
            fetchProducts();
        } catch (error: any) {
            console.error('Error saving product:', error);
            showToast(`❌ Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showToast('✅ Producto eliminado');
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            showToast(`❌ Error: ${error.message}`);
        }
    };

    const openModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price.toString());
            setStock((product.stock || 0).toString());
            setCategory(product.category || ''); // Note: category might not exist on type yet, but keeping for now
            setImageUrl(product.image_url || '');
            setMediaUrls(product.media_urls || []);
        } else {
            setEditingProduct(null);
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory('');
            setImageUrl('');
            setMediaUrls([]);
        }
        setImageFile(null);
        setMediaFiles([]);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setImageFile(null);
        setMediaFiles([]);
    };

    const removeMediaUrl = (indexToRemove: number) => {
        setMediaUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myn-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors"
                >
                    <Plus size={20} /> Nuevo Producto
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                            {product.image_url && (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            )}
                            {(product.media_urls?.length || 0) > 0 && (
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <Upload size={10} /> +{product.media_urls?.length}
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xl font-bold text-myn-primary">${product.price.toLocaleString('es-CL')}</span>
                                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(product)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Edit2 size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-2xl font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Precio (CLP)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Categoría / Origen</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myn-primary focus:border-transparent"
                                    placeholder="Ej: Kenya, Perú, Blend"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Imagen Principal</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="w-full"
                                    />
                                    {imageUrl && !imageFile && (
                                        <div className="mt-3 relative inline-block">
                                            <img src={imageUrl} alt="Preview" className="h-32 object-cover rounded-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Galería Multimedia (Imágenes/Videos)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                                        className="w-full mb-3"
                                    />

                                    {/* Existing Media Preview */}
                                    {mediaUrls.length > 0 && (
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {mediaUrls.map((url, index) => (
                                                <div key={index} className="relative shrink-0 w-20 h-20">
                                                    <img src={url} alt={`Media ${index}`} className="w-full h-full object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMediaUrl(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* New Files Preview */}
                                    {mediaFiles.length > 0 && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            {mediaFiles.length} archivos seleccionados para subir
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-3 bg-myn-primary text-white rounded-lg hover:bg-myn-dark transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            {editingProduct ? 'Guardando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        editingProduct ? 'Actualizar' : 'Crear Producto'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
