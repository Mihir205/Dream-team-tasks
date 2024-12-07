"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="back">
      <Link href="main">
      <button className="explore"><p>Explore</p></button>
      </Link>
    </div>
  );
}