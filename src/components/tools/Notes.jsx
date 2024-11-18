import { useState, useEffect } from 'react';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: '', title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentNote.title || !currentNote.content) return;

    if (isEditing) {
      setNotes(notes.map(note => 
        note.id === currentNote.id ? currentNote : note
      ));
    } else {
      setNotes([
        ...notes,
        {
          ...currentNote,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
      ]);
    }

    setCurrentNote({ id: '', title: '', content: '' });
    setIsEditing(false);
  };

  const editNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Note Form */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {isEditing ? 'Edit Note' : 'New Note'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Note title"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-40"
                    placeholder="Note content"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {isEditing ? 'Update' : 'Save'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentNote({ id: '', title: '', content: '' });
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Notes List */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                My Notes
              </h2>
              
              {notes.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No notes yet. Create your first note!
                </p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {note.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editNote(note)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      {note.createdAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {formatDate(note.createdAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes; 