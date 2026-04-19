"use client";

import Image from "next/image";
import Link from "next/link";
import { useLoginLogic } from "./login_logic";

const LoginUI = () => {
  const { setUsername, setPassword, handlerLogin } = useLoginLogic();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(238,20,88,0.28),transparent_28%),linear-gradient(135deg,#0b1020_0%,#111827_55%,#1b0f1a_100%)]" />
      <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-[#EE1458]/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex min-h-112 items-center justify-center py-4 lg:pr-10">
          <div className="absolute inset-x-16 top-1/2 h-32 -translate-y-1/2 rounded-full bg-[#EE1458]/20 blur-3xl motion-safe:animate-pulse" />
          <div className="relative flex h-60 w-60 items-center justify-center sm:h-80 sm:w-80">
            <div className="absolute inset-0 rounded-full border border-white/15 bg-white/10 motion-safe:animate-[spin_16s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-dashed border-white/15 motion-safe:animate-[spin_18s_linear_reverse_infinite]" />
            <div className="absolute inset-8 rounded-full bg-black/20 blur-sm" />
            <Image
              src="/assets/logo.png"
              alt="Animated portfolio logo"
              width={220}
              height={220}
              priority
              className="relative h-36 w-36 object-contain sm:h-44 sm:w-44 motion-safe:animate-[float_4.8s_ease-in-out_infinite]"
            />
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-white/15 via-white/8 to-white/5 blur-xl" />
          <div className="rounded-4xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/55">
                Welcome back
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Login to continue
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Use your account credentials to access the dashboard.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void handlerLogin();
              }}
            >
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white/85"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#EE1458]/70 focus:bg-white/12 focus:ring-4 focus:ring-[#EE1458]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/85"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#EE1458]/70 focus:bg-white/12 focus:ring-4 focus:ring-[#EE1458]/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#EE1458] to-[#ff4d7d] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#EE1458]/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-[#EE1458]/35 active:translate-y-0"
              >
                Login
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/70">
              <span>Belum punya akun? </span>
              <Link
                href="/auth/register"
                className="font-medium text-[#ff7ea0] transition hover:text-white hover:underline"
              >
                Registrasi di sini
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginUI;
