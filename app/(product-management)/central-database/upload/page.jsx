"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

const CentralDatabase = () => {
  return (
    <div>
      <h1 className="font-semibold text-3xl my-2">Upload Products</h1>
      <div className="bg-white px-3 py-2 rounded-lg space-y-5">
        <div className="space-y-1">
          <Label>Choose service</Label>
          <RadioGroup defaultValue="blinkit">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blinkit" id="selected-service" />
              <Label htmlFor="selected-service">Blinkit</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Enter search query</Label>
          <div className="flex items-center gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <CopyBlock
            text={code}
            language={"python"}
            showLineNumbers={true}
            wrapLines
            wrapLongLines={true}
            theme={dracula}
          />
        </div>
      </div>
    </div>
  );
};

export default CentralDatabase;
