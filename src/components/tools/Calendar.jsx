import { useState, useEffect } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', time: '' });

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addEvent = (e) => {
    e.preventDefault();
    const dateKey = formatDate(selectedDate);
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { ...newEvent, id: Date.now() }]
    }));
    setNewEvent({ title: '', description: '', time: '' });
    setShowEventForm(false);
  };

  const deleteEvent = (dateKey, eventId) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
    }));
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add week days header
    weekDays.forEach(day => {
      days.push(
        <div key={day} className="font-semibold text-center p-2 border-b">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDate(date);
      const isSelected = selectedDate && formatDate(selectedDate) === dateKey;
      const hasEvents = events[dateKey]?.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative
            ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
        >
          <span className={`${hasEvents ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}>
            {day}
          </span>
          {hasEvents && (
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6 text-sm text-gray-900 dark:text-white">
            {renderCalendarDays()}
          </div>

          {/* Events Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Events for {selectedDate.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowEventForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Event
              </button>
            </div>

            {/* Event Form */}
            {showEventForm && (
              <form onSubmit={addEvent} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            )}

            {/* Events List */}
            <div className="space-y-2">
              {events[formatDate(selectedDate)]?.map(event => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
                      {event.description && (
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{event.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEvent(formatDate(selectedDate), event.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!events[formatDate(selectedDate)]?.length && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No events scheduled for this day
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar; 