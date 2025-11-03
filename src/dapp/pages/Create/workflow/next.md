

要做到“中断后下次继续”，可以分几块实现：

1. 持久化什么

boxInfoForm + fileData（包含上传列表及必要的元数据）
allStepOutputs（每个步骤产出的缓存，后续步骤才能继续）
工作流状态：workflowStatus、currentStep、completedSteps、UI 进度
baselineVersion、changedFields 之类的追踪信息（用于重新编排）
2. 持久化到哪儿

优先考虑 localStorage/IndexedDB 等浏览器端存储。
简易实现：localStorage + JSON 序列化，适合小数据。
若涉及大文件 File/Blob，用 IndexedDB 更稳妥，可存储二进制。本流程因为文件可能很大，推荐 IndexedDB（或组合：元数据放 localStorage，文件 Blob 放 IndexedDB）。
可抽象一个 storageService，提供 saveState(state), loadState(), clearState()。
3. 同步时机

工作流每完成一个步骤后、store 更新时，调用 saveState 持久化（可节流/防抖减少写入）。
用户点击取消、关闭弹窗等，也保存一次。
成功完成后清除缓存。
4. 恢复流程

Create 页面挂载时 loadState()，如果检测到存在缓存且 workflowStatus ≠ 'success'，弹提示「检测到未完成流程，是否恢复」。
恢复时：
把缓存里的 boxInfoForm、fileData、allStepOutputs 等数据灌回 zustand store。
重建基线（调用 markBaseline / commitBaseline）。
根据 completedSteps/currentStep 调整 UI 进度。
重新执行时，changedFields 需根据缓存恢复，并用已经完成步骤作为 plan 的输入，这样编排器会从下一步继续。
5. 中断点处理

关键是 allStepOutputs：要保证每一步执行完后都把输出写进 store 并持久化。
如果某步正在处理中被中断，completedSteps 不包含那一步，下次 execute() 会重新执行该步。
已经完成的步骤还需保证依赖的数据在 store 中存在，否则恢复会失败。
6. UX / 提示

进入页面时提示“发现未完成任务”，提供“继续”和“放弃”选项；放弃则清空本地缓存并重置 store。
提示用户文件可能需要重新选择（如果文件过大且未能稳定保存，需要提醒）。
7. 注意事项

大文件缓存：如果要支持离线继续，必须确保 File/Blob 也能恢复。可以在上传前先把文件输入记录在 IndexedDB（key = uid）。
序列化：不能直接存储函数、循环引用对象；建议定义一个 PersistedState 类型，只包含纯数据。
版本管理：对于缓存 schema 建议增加 version 字段，方便未来迭代。
浏览器限制：IndexedDB 有容量限制，需判断是否异常并给出 fallback。
实施步骤建议

设计 PersistedState 接口，囊括必要字段，添加版本号。
编写 createPersistenceService：
load()：返回数据或 null
save(state)：写入
clear()
对文件分离处理，如用 idb 库存储 Blob。
在 zustand store 中监听 set（或在相关 action 内调用）来触发 save()。可用 subscribe API 实现。
Create 页挂载时 load()，判断是否恢复；根据用户选择调用 replaceState/resetAllCreateStore。
在工作流启动/完成/取消等 key point 清理或更新 baseline。
这样就能实现中断后重启继续的体验，同时保持本地数据安全与性能可控。