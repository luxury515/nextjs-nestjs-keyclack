import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tcus_cust_m')
export class TcusCustM {
  @PrimaryGeneratedColumn()
  cust_no: string;

  @Column()
  cust_id: string;

  @Column()
  cust_nm: string;

  @Column()
  eml: string;

  @Column()
  cust_cls_cd: string;

  @Column()
  cust_stat_cd: string;

  @Column()
  hp: string;

  @Column()
  join_typ_cd: string;

  @Column({ type: 'date', nullable: true })
  join_ymd: Date | null;
}
