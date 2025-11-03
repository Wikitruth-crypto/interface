/**
 * 测试组件示例
 * 
 * 展示如何在实际组件中使用新的 selector 系统
 * 
 * 使用方法：
 * 1. 将此文件复制到实际的组件目录
 * 2. 根据需要调整导入路径
 * 3. 测试功能是否正常
 */

import React from 'react';
import { useQueryStore } from './useQueryStore';
import { 
  selectBox, 
  selectUserWithBoxes,
  selectBoxesByStatus,
  selectUserOwnedBoxes 
} from './selectors';

// ========== 示例 1：Box 详情组件 ==========

interface BoxDetailProps {
  boxId: string;
}

export const BoxDetailExample: React.FC<BoxDetailProps> = ({ boxId }) => {
  // 🎉 使用 selector 自动组装嵌套数据
  const box = useQueryStore(selectBox(boxId));

  if (!box) {
    return <div>Loading box...</div>;
  }

  return (
    <div className="box-detail">
      <h2>Box #{box.tokenId}</h2>
      
      {/* ✅ 直接访问嵌套的 User 数据 */}
      <section>
        <h3>Minter Information</h3>
        <p>ID: {box.minter.id}</p>
        <p>Blacklisted: {box.minter.isBlacklisted ? 'Yes' : 'No'}</p>
      </section>

      <section>
        <h3>Owner Information</h3>
        <p>ID: {box.owner.id}</p>
        <p>Blacklisted: {box.owner.isBlacklisted ? 'Yes' : 'No'}</p>
      </section>

      {/* ✅ 访问 Token 信息 */}
      {box.acceptedToken && (
        <section>
          <h3>Payment Token</h3>
          <p>Symbol: {box.acceptedToken.symbol}</p>
          <p>Name: {box.acceptedToken.name}</p>
        </section>
      )}

      {/* ✅ 访问 Bidders 数组 */}
      {box.bidders.length > 0 && (
        <section>
          <h3>Bidders ({box.bidders.length})</h3>
          <ul>
            {box.bidders.map(bidder => (
              <li key={bidder.id}>
                {bidder.isBlacklisted ? '🚫' : '✅'} {bidder.id}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ✅ 其他 Box 信息 */}
      <section>
        <h3>Box Details</h3>
        <p>Status: {box.status}</p>
        <p>Price: {box.price}</p>
        <p>Deadline: {new Date(Number(box.deadline) * 1000).toLocaleString()}</p>
        <p>In Blacklist: {box.isInBlacklist ? 'Yes' : 'No'}</p>
      </section>
    </div>
  );
};

// ========== 示例 2：用户 Profile 组件 ==========

interface UserProfileProps {
  userId: string;
}

export const UserProfileExample: React.FC<UserProfileProps> = ({ userId }) => {
  // 🎉 使用 selector 获取带完整 Box 数据的 User
  const user = useQueryStore(selectUserWithBoxes(userId));

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile: {user.id}</h2>
      
      <p>Blacklisted: {user.isBlacklisted ? 'Yes' : 'No'}</p>
      
      {/* ✅ 显示用户拥有的 Box */}
      <section>
        <h3>Owned Boxes ({user.ownedBoxes.length})</h3>
        {user.ownedBoxes.length > 0 ? (
          <ul>
            {user.ownedBoxes.map(box => (
              <li key={box.id}>
                Box #{box.tokenId} - Status: {box.status} - Price: {box.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No owned boxes</p>
        )}
      </section>

      {/* ✅ 显示用户铸造的 Box */}
      <section>
        <h3>Minted Boxes ({user.mintedBoxes.length})</h3>
        {user.mintedBoxes.length > 0 ? (
          <ul>
            {user.mintedBoxes.map(box => (
              <li key={box.id}>
                Box #{box.tokenId} - Owner: {box.owner.id}
              </li>
            ))}
          </ul>
        ) : (
          <p>No minted boxes</p>
        )}
      </section>

      {/* ✅ 显示用户购买的 Box */}
      <section>
        <h3>Bought Boxes ({user.boughtBoxes.length})</h3>
        {user.boughtBoxes.length > 0 ? (
          <ul>
            {user.boughtBoxes.map(box => (
              <li key={box.id}>
                Box #{box.tokenId} - Status: {box.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bought boxes</p>
        )}
      </section>
    </div>
  );
};

// ========== 示例 3：Marketplace 列表组件 ==========

export const MarketplaceListExample: React.FC = () => {
  // 🎉 使用 selector 筛选特定状态的 Box
  const sellingBoxes = useQueryStore(selectBoxesByStatus('Selling'));
  const auctioningBoxes = useQueryStore(selectBoxesByStatus('Auctioning'));

  return (
    <div className="marketplace">
      <h2>Marketplace</h2>

      {/* ✅ 显示在售的 Box */}
      <section>
        <h3>For Sale ({sellingBoxes.length})</h3>
        <div className="box-grid">
          {sellingBoxes.map(box => (
            <div key={box.id} className="box-card">
              <h4>Box #{box.tokenId}</h4>
              <p>Minter: {box.minter.id}</p>
              <p>Price: {box.price} {box.acceptedToken?.symbol}</p>
              <p>Deadline: {new Date(Number(box.deadline) * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ 显示拍卖中的 Box */}
      <section>
        <h3>Auctions ({auctioningBoxes.length})</h3>
        <div className="box-grid">
          {auctioningBoxes.map(box => (
            <div key={box.id} className="box-card">
              <h4>Box #{box.tokenId}</h4>
              <p>Minter: {box.minter.id}</p>
              <p>Current Price: {box.price} {box.acceptedToken?.symbol}</p>
              <p>Bidders: {box.bidders.length}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ========== 示例 4：用户的 Box 列表 ==========

interface UserBoxesProps {
  userId: string;
}

export const UserBoxesExample: React.FC<UserBoxesProps> = ({ userId }) => {
  // 🎉 使用 selector 获取用户拥有的 Box
  const ownedBoxes = useQueryStore(selectUserOwnedBoxes(userId));

  return (
    <div className="user-boxes">
      <h2>My Boxes</h2>
      
      {ownedBoxes.length > 0 ? (
        <div className="box-grid">
          {ownedBoxes.map(box => (
            <div key={box.id} className="box-card">
              <h4>Box #{box.tokenId}</h4>
              <p>Status: {box.status}</p>
              <p>Price: {box.price}</p>
              
              {/* ✅ 可以访问嵌套的 Minter 信息 */}
              <p>Minted by: {box.minter.id}</p>
              
              {/* ✅ 可以访问 Token 信息 */}
              {box.acceptedToken && (
                <p>Payment Token: {box.acceptedToken.symbol}</p>
              )}
              
              {/* ✅ 显示 Bidders */}
              {box.bidders.length > 0 && (
                <p>Bidders: {box.bidders.length}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You don't own any boxes yet.</p>
      )}
    </div>
  );
};

// ========== 示例 5：性能优化版本（使用 useShallow） ==========

import { useShallow } from 'zustand/react/shallow';

export const OptimizedBoxDetailExample: React.FC<BoxDetailProps> = ({ boxId }) => {
  // 🎉 使用 useShallow 优化性能，只在特定字段变化时重新渲染
  const { tokenId, status, price, minterName } = useQueryStore(
    useShallow(state => {
      const box = selectBox(boxId)(state);
      return {
        tokenId: box?.tokenId,
        status: box?.status,
        price: box?.price,
        minterName: box?.minter.id,
      };
    })
  );

  return (
    <div className="box-detail-optimized">
      <h2>Box #{tokenId}</h2>
      <p>Status: {status}</p>
      <p>Price: {price}</p>
      <p>Minted by: {minterName}</p>
    </div>
  );
};

// ========== 导出所有示例组件 ==========

export const TestComponents = {
  BoxDetailExample,
  UserProfileExample,
  MarketplaceListExample,
  UserBoxesExample,
  OptimizedBoxDetailExample,
};

export default TestComponents;

