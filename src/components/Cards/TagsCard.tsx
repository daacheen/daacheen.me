import React from "react";
import { CardBody } from "reactstrap";
import { useStore } from "simstate";

import CountedArticleTag from "@/components/Article/TagGroup/CountedArticleTag";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import { Localized } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

interface Props {
  className?: string;
}

const TagsCard: React.FC<Props> = ({ className }) => {

  const metadataStore = useStore(MetadataStore);

  const tags = Array.from(metadataStore.tagMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map((entry) => entry[0]);

  return (
    <BaseCard className={className}>
      <BaseCardHeader>
        <span>🏷️ <Localized id={"tagsCard.title"}/></span>
      </BaseCardHeader>
      <CardBody>
        {tags.map((tag) => (
          <CountedArticleTag key={tag} tag={tag}/>
        ))}
      </CardBody>
    </BaseCard>
  );
};

export default TagsCard;
