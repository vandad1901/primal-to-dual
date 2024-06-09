import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-toggle";
import React from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function Header() {
    return (
        <div className="w-full border-b-2">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <h1 className="font-bold">Primal to dual converter</h1>
                <div className="flex flex-row gap-4">
                    <ModeToggle />
                    <Button variant={"outline"} size="icon" asChild>
                        <Link href="https://github.com/vandad1901">
                            <SiGithub />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
