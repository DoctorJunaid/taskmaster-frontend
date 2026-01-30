import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import './CreateTaskModal.css';

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = async (data) => {
        const selectedDate = new Date(data.duedate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

        if (selectedDate < today) {
            toast.error("Can't choose a past date!");
            return;
        }

        await onCreate(data);
        reset();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-box"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                            mass: 0.4
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-top">
                            <h2>Create New Task</h2>
                            <button className="icon-btn" onClick={onClose} aria-label="Close modal">
                                <CloseIcon />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-group">
                                <input
                                    {...register("title", { required: true })}
                                    placeholder="Task Title"
                                    autoFocus
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    {...register("description")}
                                    placeholder="Description (Optional)"
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    {...register("duedate")}
                                    type="date"
                                    required
                                />
                            </div>
                            <button type="submit" className="save-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Task'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;
