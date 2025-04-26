import React from 'react';
import {CategoryIconsProps} from '../constants/props';
import {IconCategoryName} from '../constants/types';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {
  faMoneyBill,
  faShoppingCart,
  faFileInvoiceDollar,
  faHome,
  faPlane,
  faBus,
  faUtensils,
  faShoppingBag,
  faGraduationCap,
  faUsers,
  faQuestion,
  faHeartbeat,
  faTheaterMasks,
} from '@fortawesome/free-solid-svg-icons';

const CategoryIcons: React.FC<CategoryIconsProps> = ({
  iconName,
  size = 30,
  color = '#201c5c',
}) => {
  const iconMap: Record<IconCategoryName, IconProp> = {
    salary: faMoneyBill,
    groceries: faShoppingCart,
    bills: faFileInvoiceDollar,
    rent: faHome,
    travel: faPlane,
    transportation: faBus,
    foodanddrink: faUtensils,
    shopping: faShoppingBag,
    education: faGraduationCap,
    family: faUsers,
    entertainment: faTheaterMasks,
    health: faHeartbeat,
  };
  const iconLower = iconName.toLowerCase();

  const isValidCategory = (name: string): name is IconCategoryName => {
    return Object.keys(iconMap).includes(name);
  };

  const icon = isValidCategory(iconLower) ? iconMap[iconLower] : faQuestion;

  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};

export default CategoryIcons;
