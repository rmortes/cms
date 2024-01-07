import { labelify } from "../../../utils/string.ts";

interface Props {
  collection: string;
  documents: string[];
}

export default function Template({ collection, documents }: Props) {
  return (
    <>
      <header class="header">
        <a href="/" class="button is-link">
          <u-icon name="arrow-left"></u-icon>
          Back
        </a>
        <h1 class="header-title">Content of {collection}</h1>
      </header>

      <ul class="list">
        {documents.map((document) => (
          <li>
            <a
              href={`/collection/${collection}/edit/${document}`}
              class="list-item"
            >
              <u-icon name="file"></u-icon>
              {labelify(document)}
            </a>
          </li>
        ))}
      </ul>

      <footer class="ly-rowStack footer">
        <a href={`/collection/${collection}/create`} class="button is-primary">
          <u-icon name="plus-circle"></u-icon>
          Create new
        </a>
      </footer>
    </>
  );
}
