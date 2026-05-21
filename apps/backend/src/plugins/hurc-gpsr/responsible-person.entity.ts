import { type DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

/**
 * EU GPSR (General Product Safety Regulation) requires every product sold in
 * the EU to have a "responsible person" inside the EU who can be contacted
 * about safety concerns. We model them as a first-class entity so multiple
 * products can share one (e.g. our EU-fulfilment partner) and the row stays
 * referentially intact even if a product is deleted.
 */
@Entity()
export class ResponsiblePerson extends VendureEntity {
  constructor(input?: DeepPartial<ResponsiblePerson>) {
    super(input);
  }

  // tsx (esbuild backend) does not emit `design:type` decorator metadata,
  // so column types must be specified explicitly. Vendure's entities bake
  // the metadata into their published dist; ours run from TS source.
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'text' })
  address!: string;
}
