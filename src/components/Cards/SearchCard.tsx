import React from "react";
import { CardBody } from "reactstrap";

import SearchBar from "@/components/Article/SearchBar/SearchBar";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import { Localized } from "@/i18n";

const SearchCard: React.FC = () => {
  return (
    <BaseCard>
      <BaseCardHeader>
        <span>🔎 <Localized id="search.cardTitle" /></span>
      </BaseCardHeader>
      <CardBody>
        <SearchBar />
      </CardBody>
    </BaseCard>
  );
};

export default SearchCard;
