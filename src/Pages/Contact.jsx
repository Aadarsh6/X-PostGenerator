// pages/contact.jsx (A new page in your project)
import React from 'react';
import { ShimmerButton } from '@/components/magicui/shimmer-button'; // Adjust path as needed

export default function ContactPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-24 sm:pt-32">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Get In Touch
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <form 
          // You would connect this to a backend service like Resend, Formspark, or a serverless function
          className="mt-12 text-left space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300">Your Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required
              className="mt-2 block w-full bg-neutral-900 border border-neutral-700 rounded-md p-3 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-300">Message</label>
            <textarea 
              name="message" 
              id="message" 
              rows={5} 
              required
              className="mt-2 block w-full bg-neutral-900 border border-neutral-700 rounded-md p-3 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="text-right">
            <ShimmerButton type="submit">
              Send Message
            </ShimmerButton>
          </div>
        </form>
      </div>
    </div>
  );
}
