import { ReactNode, FC } from "react";
import styles from "./Item.module.css";
import clsx from "clsx";
interface IItemProps {
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}
export const Item: FC<IItemProps> = ({ children, className, actions }) => {
  const _class = clsx(styles.item, className);
  return (
    <div className={_class}>
      <div className={styles.content}>{children}</div>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
};
