// ...existing code...
"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerHref?: string;
};

export default function AuthCard({ title, children, footerText, footerLinkText, footerHref }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
              F
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
              <p className="text-sm text-gray-500">Access your Faras dashboard</p>
            </div>
          </div>

          <div>{children}</div>

          {footerText && footerLinkText && footerHref && (
            <p className="text-center text-sm text-gray-500 mt-6">
              {footerText}{" "}
              <Link href={footerHref} className="text-emerald-600 font-medium hover:underline">
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Faras — Insights made simple
        </p>
      </div>
    </div>
  );
}