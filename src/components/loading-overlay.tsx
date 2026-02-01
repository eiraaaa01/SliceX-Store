'use client';

import { LoadingLogo } from '@/components/loading-logo';
import { useLoading } from '@/context/LoadingContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <LoadingLogo />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
