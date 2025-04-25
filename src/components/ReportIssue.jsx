import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Import your Supabase client
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook

const ReportIssue= ({ setFormVisible }) => {
  const [issueTitle, setIssueTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]); // This will hold File objects
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Use the useAuth hook to get the user

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (!files) return;

        const newImages = Array.from(files);

        // Basic file type validation
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const invalidFiles = newImages.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            alert('Invalid file type. Please upload images only.');
            return;
        }

        // Basic file size validation (e.g., 5MB limit)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        const largeFiles = newImages.filter(file => file.size > maxSizeInBytes);
        if (largeFiles.length > 0) {
            alert('File size too large. Maximum 5MB allowed.');
            return;
        }

        if (images.length + newImages.length > 3) {
            alert('Maximum 3 images allowed.');
            return;
        }

        setImages([...images, ...newImages]);
    };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };


  const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user) {
            alert("You must be logged in to report an issue.");
            setIsSubmitting(false);
            return;
        }

        try {
             const { error: insertError } = await supabase.from('issues').insert([
                {
                    title: issueTitle,
                    description: description,
                    location: location,
                    image_url: images.map(image => image.name), // Store the image names
                    created_by: user.id, // Use the user ID from auth
                },
            ]);

            if (insertError) {
                throw new Error(`Failed to insert issue: ${insertError.message}`);
            }

            alert('Issue reported successfully!');
            setFormVisible(false);
            setIssueTitle('');
            setDescription('');
            setLocation('');
            setImages([]);


        } catch (error) {
             console.error("Error submitting form:", error);
            alert("There was an error submitting your report. Please try again.");

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
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Report a New Issue</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Issue Title</label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="What's the issue?"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
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
              placeholder="e.g. Engineering Building, Room 101"
              className="w-full border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-purple-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Images</label>
            <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer text-gray-500 hover:border-purple-400 transition duration-300">
              <UploadCloud className="mr-3 w-5 h-5" />
              <span>Upload up to 3 images (optional)</span>
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
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



const Card = ({ issue }) => {
    // Placeholder image URLs (you can customize these)
    const placeholderImages = [
        'https://placehold.co/400x300/EEE/31343C?text=Issue+1&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Issue+2&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Issue+3&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Issue+4&font=Montserrat',
        'https://placehold.co/400x300/EEE/31343C?text=Issue+5&font=Montserrat',
    ];

    // Get a random placeholder image
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <img
                src={randomImage} // Use the random placeholder
                alt={`Issue: ${issue.title}`}
                className="w-full h-48 object-cover" // Adjust height as needed
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{issue.location}</p>
                <p className="text-gray-700 text-base">{issue.description}</p>
                {/* You can add more details here, like status, priority, etc. */}
            </div>
        </div>
    );
};


export default ReportIssue;
