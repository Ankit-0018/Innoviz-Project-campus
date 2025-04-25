import React, { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import your Supabase client (adjust the path if needed)

const ReportItem = ({ setFormVisible }) => {
  const [itemType, setItemType] = useState('Lost Item');
  const [itemTitle, setItemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const uploaded = Array.from(files);

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const invalidFiles = uploaded.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Only image files are allowed.');
      return;
    }

    // Validate file sizes (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    const largeFiles = uploaded.filter(file => file.size > maxSize);

    if (largeFiles.length > 0) {
      alert('Each image must be less than 5MB.');
      return;
    }

    if (uploaded.length + images.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }

    setImages([...images, ...uploaded]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

      const uploadedImageUrls = images.map(image => image.name);


    try {
      const { data, error } = await supabase
        .from('lost_found') 
        .insert([
          {
            title: itemTitle, // Use the correct column name
            description: description, // Use the correct column name
            location: location, // Use the correct column name
            status: itemType, // Store item type as status
             
          },
        ]);

      if (error) {
        throw new Error(`Failed to insert item: ${error.message}`);
      }

      alert("Item reported successfully!");
      setFormVisible(false);
      setItemType('Lost Item');
      setItemTitle('');
      setDescription('');
      setLocation('');
      setImages([]);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 z-50 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-xl p-8 shadow-lg relative overflow-hidden transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
          onClick={() => setFormVisible(false)}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Report Lost or Found Item</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Item Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Lost Item"
                  checked={itemType === 'Lost Item'}
                  onChange={(e) => setItemType(e.target.value)}
                  className="mr-1"
                />
                Lost Item
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Found Item"
                  checked={itemType === 'Found Item'}
                  onChange={(e) => setItemType(e.target.value)}
                  className="mr-1"
                />
                Found Item
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Item Title</label>
            <input
              type="text"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="What's the item?"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail..."
              rows={4}
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Library, 2nd Floor"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Images</label>
            <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer text-gray-500 hover:border-purple-400 transition duration-300">
              <UploadCloud className="mr-3 w-5 h-5" />
              <span>Upload up to 3 images (highly recommended)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-gray-200 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`upload-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 p-1 bg-white rounded-bl-md hover:bg-red-100 transition duration-200"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-md border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300"
              onClick={() => setFormVisible(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition duration-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



const Card = ({ items }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);
    const placeholderImages = [
        'https://placehold.co/400x300/EEE/31343C?text=Lost+Item&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Found+Item&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Item+1&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Item+2&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Item+3&font=Montserrat',
    ];

    const toggleExpanded = (id) => {
        setExpandedItemId((prevId) => (prevId === id ? null : id));
    };


  if (!items) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full sm:w-[48%] lg:w-[32%] bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
        >
          {/* Header */}
          <header className="space-y-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className={`px-2 py-0.5 rounded-full ${
                item.status === 'Lost Item' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {item.status}
              </span>
            </div>
          </header>

          {/* Location  */}
          <p className="text-xs text-gray-400">{item.location}</p>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              {expandedItemId === item.id
                ? item.description
                : `${item.description.slice(0, 100)}...`}
            </p>
            {item.image_url && item.image_url[0]  ? (
                            <img
                                src={item.image_url[0]}
                                alt={`Item: ${item.title}`}
                                className="rounded-lg w-full h-48 object-cover"
                            />
                        ) : (
                            <img
                                src={placeholderImages[Math.floor(Math.random() * placeholderImages.length)]}
                                alt={`Item: ${item.title}`}
                                className="rounded-lg w-full h-48 object-cover"
                            />
                        )}
            {item.description.length > 100 && (
              <span
                className="text-xs text-blue-600 cursor-pointer select-none"
                onClick={() => toggleExpanded(item.id)}
              >
                {expandedItemId === item.id ? "Show less ↑" : "Show more ↓"}
              </span>
            )}
          </div>

          {/* Footer */}
          <footer className="flex justify-between items-center border-t pt-3">
            <div className="flex items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Reporter"
                className="w-7 h-7 rounded-full object-cover"
              />
              <p className="text-sm text-gray-600">
                {item.created_by || "Unknown"}
              </p>
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
};

//  Parent component to hold both form and cards, and fetch data
const LostAndFoundPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [items, setItems] = useState([]);

     const getItems = async () => {
        try {
            const { data, error } = await supabase.from('lost_found').select('*');
            if (error) {
                throw new Error(`Error fetching items: ${error.message}`);
            }
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch lost and found items", error);
            alert("Failed to load lost and found items."); // basic error notification
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Lost and Found</h1>
            <div className="flex justify-center mb-6">
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    onClick={() => setIsFormVisible(true)}
                >
                    Report an Item
                </button>
            </div>

            {isFormVisible && (
                <ReportItemForm setFormVisible={setIsFormVisible} />
            )}

            <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Reports</h2>
                {items.length > 0 ? (
                    <Card items={items} />
                ) : (
                    <p className="text-gray-500">No items have been reported yet.</p>
                )}
            </section>
        </div>
    );
};

export default ReportItem;
