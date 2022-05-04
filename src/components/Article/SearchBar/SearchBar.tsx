import { navigate } from "gatsby";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button,Input, InputGroup, InputGroupAddon } from "reactstrap";
import { useStore } from "simstate";

import { useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

interface Props {
  onSearch?(): void;
  className?: string;
  onFocus?(): void;
  onBlur?(): void;
}

const SearchBar: React.FC<Props> = (props: Props) => {

  const metadataStore = useStore(MetadataStore);
  const [input, setInput] = useState("");

  const { translate } = useI18n();

  const placeholder = translate(
    "search.inputPlaceholder",
    [metadataStore.articleCount]) as string;

  const onSearch = (): void => {
    navigate(`/articles/search?query=${encodeURIComponent(input)}`);
    if (props.onSearch) {
      props.onSearch();
    }
  };

  return (
    <InputGroup className={props.className}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />
      <InputGroupAddon addonType="append">
        <Button onClick={onSearch} color="secondary"><FaSearch /></Button>
      </InputGroupAddon>
    </InputGroup>
  );

};

export default SearchBar;
