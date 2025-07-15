"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import ModernSignin from "../../../components/Auth/ModernSignin";

interface SignInProps {
  setAuthPage: () => void;
  onLogin: (token: string) => void;
}

const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;

const ModernSignIn: React.FC<SignInProps> = ({ setAuthPage, onLogin }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-300/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-100/50 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1500"></div>

        {/* Additional Desktop Background Elements */}
        <div className="hidden lg:block absolute top-1/4 left-1/6 w-20 h-20 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="hidden lg:block absolute top-1/3 right-1/4 w-16 h-16 bg-indigo-400/25 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="hidden lg:block absolute bottom-1/3 left-1/5 w-24 h-24 bg-blue-200/30 rounded-full blur-lg animate-pulse delay-1200"></div>
        <div className="hidden lg:block absolute bottom-1/4 right-1/6 w-18 h-18 bg-indigo-300/20 rounded-full blur-lg animate-pulse delay-900"></div>

        {/* Medical Icons */}
        <div className="absolute top-48 right-1/3 w-6 h-6 text-indigo-300/40 animate-pulse">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Desktop Medical Icons */}
        <div className="hidden lg:block absolute top-1/4 left-1/4 w-8 h-8 text-blue-300/30 animate-bounce">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-6 h-6 text-indigo-300/30 animate-pulse delay-500">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Left Side - Form */}
        <div className="flex w-full flex-col justify-center px-4 py-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="mb-4 text-center">
              <Link href="/" className="inline-block">
                <Image
                  src={`${AWS_URL}/docpoc-images/logo-icon.png`}
                  alt="DocPoc Logo"
                  width={180}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Sign in to your DocPoc account
              </p>
            </div>

            {/* Sign In Form */}
            <ModernSignin setAuthPage={setAuthPage} onLogin={onLogin} />

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth-v2/signup"
                  className="font-medium text-primary hover:text-primary/80 dark:text-primary/80 dark:hover:text-primary transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary via-primary/90 to-primary/80">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-40 left-20 w-12 h-12 bg-white/15 rounded-full blur-sm animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-40 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse delay-500"></div>

          {/* Additional Desktop Floating Elements */}
          <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-white/8 rounded-full blur-sm animate-pulse delay-300"></div>
          <div className="absolute bottom-1/3 left-1/4 w-18 h-18 bg-white/12 rounded-full blur-sm animate-pulse delay-700"></div>
          <div className="absolute top-2/3 right-1/5 w-12 h-12 bg-white/10 rounded-full blur-sm animate-pulse delay-1200"></div>

          {/* Medical Icons */}
          <div className="absolute bottom-32 left-32 w-6 h-6 text-white/30 animate-pulse">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Additional Desktop Medical Icons */}
          <div className="absolute top-1/4 right-1/4 w-8 h-8 text-white/25 animate-bounce delay-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 right-1/3 w-6 h-6 text-white/25 animate-pulse delay-600">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative flex h-full flex-col justify-center px-12 py-6">
            <div className="mx-auto max-w-md">
              <div className="mb-4">
                <Image
                  src={`${AWS_URL}/docpoc-images/logo-icon.png`}
                  alt="DocPoc Logo"
                  width={200}
                  height={50}
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                Streamline Your Medical Practice
              </h1>

              <p className="text-base text-blue-100 leading-relaxed mb-4">
                Join thousands of healthcare professionals who trust DocPoc to
                manage their practice efficiently.
              </p>

              {/* Feature List */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-blue-100">
                    Secure patient data management
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-blue-100">
                    Smart appointment scheduling
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-blue-100">
                    Comprehensive reporting & analytics
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        DR
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-blue-100 text-sm italic">
                      &ldquo;DocPoc has transformed how we manage our clinic.
                      The interface is intuitive and the support team is always
                      helpful.&rdquo;
                    </p>
                    <p className="text-blue-200 text-xs mt-2">
                      - Dr. Sarah Johnson, Cardiology
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-blue-200">Clinics</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-xs text-blue-200">Patients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-blue-200">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSignIn;
