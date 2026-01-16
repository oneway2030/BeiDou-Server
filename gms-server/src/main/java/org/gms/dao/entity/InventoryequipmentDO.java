package org.gms.dao.entity;

import com.mybatisflex.annotation.Column;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import java.io.Serializable;

import lombok.*;

import java.io.Serial;

/**
 *  实体类。
 *
 * @author sleep
 * @since 2024-05-24
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("inventoryequipment")
public class InventoryequipmentDO implements Serializable  {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id(keyType = KeyType.Auto)
    private Long inventoryequipmentid;

    private Long inventoryitemid;

    private Integer upgradeslots;

    private Integer level;

    private Integer str;

    private Integer dex;

    @Column("int")
    private Integer inte;

    private Integer luk;

    private Integer hp;

    private Integer mp;

    private Integer watk;

    private Integer matk;

    private Integer wdef;

    private Integer mdef;

    private Integer acc;

    private Integer avoid;

    private Integer hands;

    private Integer speed;

    private Integer jump;

    private Integer locked;

    private Integer vicious;

    private Integer itemlevel;

    private Integer itemexp;

    private Integer ringid;

    private String upgradehistory;

    private Integer levelExpand;
    //套装类型
    private Integer combinationType;
    //混沌卷升级记录
    private String chaosHistory = "";
    //装备吸收历史
    private String absorbHistory = "";

    private Integer expandAttribute1;

    private Integer expandAttribute2;

    private String expandAttribute3;

    private String expandAttribute4;

    private Integer maxStar;//最大星级

    private Integer starLevel;//已升星次数

    private Integer starCount;//当前星级数失败次数

    private Integer upgradeResetCount;//洗练次数

    private Integer upgradeReturn;//洗练返回次数

}
