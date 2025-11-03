

// import React from 'react';
import styles from './styles.module.scss'


function DAO() {

    return (
        <>
            <div className={styles.home}>
                <div className={styles.first}>
                    <div className={styles.left}>
                        <span>
                            <h1 className={styles.title01}>Truth</h1>
                            <h1 className={styles.title02}>Market</h1>
                        </span>
                        <p>
                            The truth will eventually be revealed, <br />
                            and the criminals will eventually be judged!
                        </p>
                    </div>
                    <div className={styles.right}>
                        <p>DAO will be in the subsequent development plan</p>
                        <p>Please wait!</p>
                    </div>
                </div>
            
                <div className={styles.second}>

                    <div className={styles.horizontalLine}></div> 
                    <div className={styles.third}>

                    </div>
                    <div className={styles.horizontalLine}></div> 

                </div>
                
            </div>
        </>
        

    );
}

export default DAO;