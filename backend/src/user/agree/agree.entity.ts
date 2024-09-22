import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tcus_agre_m', { schema: 'dfp' })
export class Agree {
  @PrimaryGeneratedColumn('uuid')
  agre_no: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tmcnd_plcy_cls_cd: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  scrn_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cust_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cust_nm: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  eml: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  agre_yn: string;

  @Column({ type: 'timestamp', nullable: true })
  agre_dtm: Date;

  @Column({ type: 'varchar', length: 100 })
  inpt_usr_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  inpt_dtm: Date;

  @Column({ type: 'varchar', length: 100 })
  updt_usr_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updt_dtm: Date;
}