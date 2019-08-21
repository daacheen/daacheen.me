import React, { useState, useRef, useCallback } from "react";

import { FaLink } from "react-icons/fa";
import Action from "@/components/Article/Actions/Action";
import lang from "@/i18n/lang";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import LocalizedString from "@/i18n/LocalizedString";
import { useEventListener } from "@/utils/useEventListener";

const root = lang.articlePage.actions.copyLink;

interface Props {
  articleId: string;
}

const CopyLinkAction: React.FC<Props> = ({ articleId }) => {

  const metadataStore = useStore(MetadataStore);

  const [ copied, setCopied ] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  useEventListener(ref, "mouseleave", () => {
    console.log("leave");
    setCopied(false);
  });

  const actionOnClick = useCallback(async () => {
    await navigator.clipboard.writeText(`${metadataStore.baseUrl}/articles/${articleId}`)
    setCopied(true);
  }, [articleId]);

  return (
    <Action ref={ref} Icon={FaLink} onClick={actionOnClick}>
      <LocalizedString id={copied ? root.copied : root.copyLink}/>
    </Action>
  );
}

export default CopyLinkAction;
