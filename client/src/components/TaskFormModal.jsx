const TaskFormModal = ({
    title,
    formData,
    setFormData,
    onClose,
    onSubmit,
    submitting,
    mode = "Add",
}) => {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed inset-0 bg-opacity-30 z-45" onClick={onClose} />
            <form
                onSubmit={onSubmit}
                onClick={(e) => e.stopPropagation()}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            >
                <h3 className="text-xl font-semibold mb-4">{mode} Task</h3>

                <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                    required
                    autoFocus
                />

                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
                    rows={3}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                </label>
                <input
                    type="date"
                    value={formData.dueDate?.slice(0, 10) || ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                    required
                />

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {submitting ? `${mode}ing...` : `${mode} Task`}
                    </button>
                </div>
            </form>
        </>
    );
};

export default TaskFormModal;