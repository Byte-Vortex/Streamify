"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tag, getTagInfo } from "@/lib/lastfm";
import { LoaderCircle } from "lucide-react";

interface TagModalProps {
  tag: Tag;
  isOpen: boolean;
  onClose: () => void;
}

export function TagModal({ tag, isOpen, onClose }: TagModalProps) {
  const [datatag, setDataTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && tag) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const tagInfo = await getTagInfo(tag.name);
          setDataTag(tagInfo);
        } catch (error) {
          console.error("Error fetching tag data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, tag]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        {loading ? (<div className="flex justify-center items-center">
            <LoaderCircle className="animate-spin"></LoaderCircle>
        </div>) : datatag? (
            <>
            <DialogHeader>
          <DialogTitle className="pt-5">
            <h4 className="capitalize text-lg">{datatag?.name}</h4>
          </DialogTitle>
          <div className="flex justify-between text-sm text-gray-500">
          <p>Reach: <span className="text-blue-400">{datatag?.reach}</span></p>
          <p>Total: <span className="text-blue-400">{datatag?.total}</span></p>
          </div>
          
        </DialogHeader>
       
          <p className="text-sm text-justify"
            dangerouslySetInnerHTML={{
              __html: datatag?.wiki.summary ?? "No summary available",
            }}
          />
            </>
        ):'No Data Available'}
        
      </DialogContent>
    </Dialog>
  );
}
