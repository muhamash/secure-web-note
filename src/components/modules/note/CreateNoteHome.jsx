'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateUserNote } from '@/lib/services/note/user.service';
import { Plus, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import toast from 'react-hot-toast';

export default function EditNotePage({ singleNotePromise }) {
  const router = useRouter();


  const noteData = use(singleNotePromise)?.data?.data;

  const [formData, setFormData] = useState({
    title: noteData?.title || '',
    content: noteData?.content || '',
    tags: noteData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await updateUserNote( noteData?._id, formData );

      console.log(response)

      // const resData = await response.json();

      if (!response.success) throw new Error(response.message || 'Failed to update note');

      router.push('/'); 
    }
    catch ( err )
    {
      console.error('Update Note Error:', err);
      toast.error(err.message || 'Something went wrong');
    }
    finally
    {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push('/');

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Note
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Update your note details
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter note title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`h-11 ${
                    errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your note content..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={12}
                  className={`resize-none ${
                    errors.content ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-11 border-slate-300 dark:border-slate-700"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="h-11">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-sm bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 pr-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={handleCancel} className="h-11">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg"
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" /> Update Note
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}