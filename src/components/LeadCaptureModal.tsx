
import { useState } from 'react';
import { usePlanStore } from '../store/planStore';
import { Check, Loader2, Download, Mail } from 'lucide-react';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LeadCaptureModal = ({ isOpen, onClose }: LeadCaptureModalProps) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'New Build'
    });

    const { totalCostLow, totalCostHigh, totalSqFt } = usePlanStore();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call / Email service
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setStep('success');
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {step === 'form' ? (
                    <div className="p-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800">Save Your Design</h2>
                            <p className="text-slate-500 mt-2">
                                Enter your email to unlock your full estimate and download the plans.
                            </p>
                        </div>

                        {/* Order Summary Mini */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-600">Total Area</span>
                                <span className="text-sm font-bold text-slate-800">{totalSqFt} sq.ft</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-600">
                                <span className="text-sm font-medium">Estimated Range</span>
                                <span className="text-sm font-bold">
                                    {formatCurrency(totalCostLow)} - {formatCurrency(totalCostHigh)}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Get Detailed Quote
                                        <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Success!</h2>
                        <p className="text-slate-500 mb-8">
                            We've sent the detailed breakdown and floorplan to <strong>{formData.email}</strong>.
                        </p>

                        <button
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            onClick={() => window.alert("Feature coming soon: This would trigger a PDF download.")}
                        >
                            <Download className="w-4 h-4" />
                            Download Floorplan PDF
                        </button>

                        <button
                            onClick={onClose}
                            className="mt-4 text-sm text-slate-400 hover:text-slate-600"
                        >
                            Back to Editor
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
