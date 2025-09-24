import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-6">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

export default LoadingSpinner;