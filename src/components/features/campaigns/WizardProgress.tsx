"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { WizardStep } from "@/src/types";

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all",
                  step.number < currentStep && "bg-success text-white",
                  step.number === currentStep &&
                    "bg-brand-primary text-white ring-4 ring-brand-primary/20",
                  step.number > currentStep && "bg-slate-800 text-slate-500",
                )}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs md:text-sm font-semibold",
                    step.number === currentStep
                      ? "text-text-primary"
                      : "text-text-tertiary",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-text-tertiary hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 md:mx-4 rounded-full transition-all",
                  step.number < currentStep ? "bg-success" : "bg-slate-800",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
