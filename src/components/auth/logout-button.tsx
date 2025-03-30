"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
}
