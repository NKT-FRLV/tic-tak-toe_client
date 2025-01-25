import styles from './loader.module.css'

const ThreeDots = ({ visible = true, height = "1rem", width = "3.5rem", color = "#646cffaa", ariaLabel = "three-dots-loading" }) => {
  if (!visible) return null;

  return (
    <div
      className={styles.threeDotsLoader}
      style={{ height, width }}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
      <div className={styles.dot} style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default ThreeDots;
