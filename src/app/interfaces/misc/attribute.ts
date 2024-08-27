import { AttributeValue } from "./attribute-value";

export interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}
