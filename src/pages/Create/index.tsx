'use client';

import { useInputChangeTracker } from './hooks/useInputChangeTracker';
import FormContainer from './containers/formContainer';
import { CreateFormProvider } from './context/CreateFormContext';
import { cn } from '@/lib/utils';

interface CreateProps {
    className?: string;
}

export default function Create({ className }: CreateProps) {
    useInputChangeTracker();
    
    return (
        <CreateFormProvider>
            <div className={cn("flex flex-col items-center justify-center w-full ", className)}>
                <FormContainer />
                {/* <SmartRetryTest /> */}
            </div>
        </CreateFormProvider>
    );
}
