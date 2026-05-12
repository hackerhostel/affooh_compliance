import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import {
  PlusIcon,
  TrashIcon,
  UserIcon,
  CloudArrowUpIcon,
  BuildingOffice2Icon,
  ArrowPathIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import Modal from '../../components/Modal';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import SaveVersionPopup from '../../components/SaveVersionPopup';
import { selectSelectedProject } from '../../state/slice/projectSlice';
import { selectUser } from '../../state/slice/authSlice';
import { fetchOrgStructure, saveOrgStructure, updateOrgStructure, createRevisionHistory, createApproval } from '../../utils/complianceApi';
import axios from 'axios';

const DOCUMENT_TYPE = "ORG_STRUCTURE";

// ─── Helpers ────────────────────────────────────────────────────────────────

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const makeNode = (label = '', user = null) => ({
  id: genId(),
  label,
  userId: user?.value || null,
  user: user
    ? { id: user.value, firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.avatar }
    : null,
  children: [],
});

// Immutable tree operations
const addChildNode = (root, parentId, newNode) => {
  if (root.id === parentId) return { ...root, children: [...root.children, newNode] };
  return { ...root, children: root.children.map(n => addChildNode(n, parentId, newNode)) };
};

const addSiblingNode = (root, nodeId, newNode, direction) => {
  const tryInsert = (node) => {
    const idx = node.children.findIndex(c => c.id === nodeId);
    if (idx !== -1) {
      const children = [...node.children];
      direction === 'left' ? children.splice(idx, 0, newNode) : children.splice(idx + 1, 0, newNode);
      return { ...node, children };
    }
    return { ...node, children: node.children.map(tryInsert) };
  };
  return tryInsert(root);
};

const deleteNodeById = (root, nodeId) => ({
  ...root,
  children: root.children.filter(c => c.id !== nodeId).map(n => deleteNodeById(n, nodeId)),
});

const updateNodeById = (root, nodeId, updates) => {
  if (root.id === nodeId) return { ...root, ...updates };
  return { ...root, children: root.children.map(n => updateNodeById(n, nodeId, updates)) };
};

const findNode = (node, id) => {
  if (!node) return null;
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
};

// ─── Node Card ───────────────────────────────────────────────────────────────

function NodeCard({ node, isRoot, onAddLeft, onAddRight, onAddDown, onDelete, onEditTitle, onAssignUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditLabel(node.label);
  }, [node.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.select();
  }, [isEditing]);

  const commitEdit = () => {
    const trimmed = editLabel.trim();
    onEditTitle(node.id, trimmed || node.label);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditLabel(node.label); setIsEditing(false); }
  };

  const initials = node.user
    ? `${node.user.firstName?.[0] || ''}${node.user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <div className="relative group" style={{ width: 176, flexShrink: 0 }}>

      {/* ── Sibling buttons (non-root only) ── */}
      {!isRoot && (
        <>
          <button
            onClick={onAddLeft}
            title="Add peer to the left"
            className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                       transition-opacity w-7 h-7 rounded-full bg-primary-pink text-white shadow-md
                       hover:bg-pink-600 flex items-center justify-center z-20"
            style={{ left: -34 }}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onAddRight}
            title="Add peer to the right"
            className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                       transition-opacity w-7 h-7 rounded-full bg-primary-pink text-white shadow-md
                       hover:bg-pink-600 flex items-center justify-center z-20"
            style={{ right: -34 }}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </>
      )}

      {/* ── Main card ── */}
      <div
        className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm
                   group-hover:border-pink-300 group-hover:shadow-md transition-all duration-200 relative"
      >
        {/* Delete */}
        {!isRoot && (
          <button
            onClick={() => onDelete(node.id)}
            title="Delete node"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                       w-5 h-5 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500
                       flex items-center justify-center"
          >
            <TrashIcon className="w-3 h-3" />
          </button>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          {node.user ? (
            <button
              onClick={() => onAssignUser(node.id)}
              title="Change assigned user"
              className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center
                         text-white text-xl font-semibold shadow-sm hover:ring-2 hover:ring-pink-300
                         hover:ring-offset-1 transition-all overflow-hidden"
            >
              {node.user.avatar
                ? <img src={node.user.avatar} alt={initials} className="w-full h-full object-cover" />
                : (initials || <UserIcon className="w-7 h-7" />)}
            </button>
          ) : (
            <button
              onClick={() => onAssignUser(node.id)}
              title="Assign user to this position"
              className="w-14 h-14 rounded-full bg-gray-50 border-2 border-dashed border-gray-300
                         flex items-center justify-center hover:border-pink-400 hover:bg-pink-50
                         transition-all"
            >
              <UserIcon className="w-7 h-7 text-gray-400" />
            </button>
          )}
        </div>

        {/* Title */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editLabel}
            onChange={e => setEditLabel(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-sm font-semibold text-center border-b-2 border-pink-300
                       outline-none bg-transparent text-gray-800 pb-0.5"
          />
        ) : (
          <button onClick={() => setIsEditing(true)} title="Click to edit title" className="w-full text-center">
            {node.label ? (
              <p className="font-semibold text-sm text-gray-800 truncate hover:text-pink-500 transition-colors">
                {node.label}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">Click to set title</p>
            )}
          </button>
        )}

        {/* User name / assign link */}
        {node.user ? (
          <div className="mt-1 text-center">
            <p className="text-xs text-gray-500 truncate">
              {node.user.firstName} {node.user.lastName}
            </p>
            <button
              onClick={() => onAssignUser(node.id)}
              className="text-xs text-pink-400 hover:text-pink-600 transition-colors
                         opacity-0 group-hover:opacity-100"
            >
              Change user
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAssignUser(node.id)}
            className="text-xs text-pink-400 hover:text-pink-600 transition-colors text-center w-full mt-1"
          >
            + Assign User
          </button>
        )}
      </div>

      {/* ── Add below button ── */}
      <button
        onClick={onAddDown}
        title="Add direct report below"
        className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                   transition-opacity w-7 h-7 rounded-full bg-primary-pink text-white shadow-md
                   hover:bg-pink-600 flex items-center justify-center z-20"
        style={{ bottom: -34 }}
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Org Subtree ─────────────────────────────────────────────────────────────

const STEM = 28;   // px: vertical line from node to branch
const DROP = 28;   // px: vertical drop from branch to child

function OrgSubtree({ node, isRoot, callbacks }) {
  const { onAddDown, onAddLeft, onAddRight, onDelete, onEditTitle, onAssignUser } = callbacks;
  const children = node.children || [];
  const hasChildren = children.length > 0;

  return (
    <div className="flex flex-col items-center" style={{ position: 'relative' }}>
      <NodeCard
        node={node}
        isRoot={isRoot}
        onAddDown={() => onAddDown(node.id)}
        onAddLeft={() => onAddLeft(node.id)}
        onAddRight={() => onAddRight(node.id)}
        onDelete={onDelete}
        onEditTitle={onEditTitle}
        onAssignUser={onAssignUser}
      />

      {hasChildren && (
        <>
          {/* Stem from node down to branch level */}
          <div style={{ width: 2, height: STEM, background: '#d1d5db', flexShrink: 0 }} />

          {/* Children row */}
          <div className="flex items-start">
            {children.map((child, i) => {
              const isFirst = i === 0;
              const isLast = i === children.length - 1;
              const isOnly = children.length === 1;

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                  style={{ paddingLeft: 20, paddingRight: 20 }}
                >
                  {/* Branch connector */}
                  {isOnly ? (
                    <div style={{ width: 2, height: DROP, background: '#d1d5db' }} />
                  ) : (
                    <div className="flex w-full" style={{ height: DROP }}>
                      {/* Left half – transparent on first child */}
                      <div style={{
                        flex: 1,
                        borderTop: '2px solid',
                        borderColor: isFirst ? 'transparent' : '#d1d5db',
                      }} />
                      {/* Center vertical drop */}
                      <div style={{ width: 2, background: '#d1d5db', flexShrink: 0 }} />
                      {/* Right half – transparent on last child */}
                      <div style={{
                        flex: 1,
                        borderTop: '2px solid',
                        borderColor: isLast ? 'transparent' : '#d1d5db',
                      }} />
                    </div>
                  )}

                  <OrgSubtree node={child} isRoot={false} callbacks={callbacks} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Add / Assign Modals ─────────────────────────────────────────────────────

function AddNodeModal({ isOpen, onClose, onConfirm, direction, type, userOptions }) {
  const [label, setLabel] = useState('');
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setLabel(''); setUser(null); }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const title = type === 'child'
    ? 'Add Direct Report Below'
    : direction === 'left'
      ? 'Add Peer to the Left'
      : 'Add Peer to the Right';

  const handleConfirm = () => {
    if (!label.trim()) return;
    onConfirm(label.trim(), user);
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} titleClassName="!text-base">
      <div className="flex flex-col gap-4" style={{ width: 320 }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position Title <span className="text-red-500">*</span>
          </label>
          <input
            ref={inputRef}
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            placeholder="e.g. Chief Executive Officer"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none
                       focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign User <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <Select
            value={user}
            onChange={setUser}
            options={userOptions}
            isClearable
            placeholder="Select a team member..."
            styles={{
              control: (base) => ({
                ...base, borderColor: '#d1d5db', borderRadius: 8, fontSize: 14, minHeight: 38,
              }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm
                       hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!label.trim()}
            className="flex-1 px-4 py-2 bg-primary-pink text-white rounded-lg text-sm font-medium
                       hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Node
          </button>
        </div>
      </div>
    </Modal>
  );
}

function AssignUserModal({ isOpen, onClose, onConfirm, currentUser, userOptions }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUser(currentUser
        ? userOptions.find(o => o.value === currentUser.id) || null
        : null);
    }
  }, [isOpen, currentUser]);

  return (
    <Modal title="Assign User to Position" isOpen={isOpen} onClose={onClose} titleClassName="!text-base">
      <div className="flex flex-col gap-4" style={{ width: 300 }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Team Member</label>
          <Select
            autoFocus
            value={user}
            onChange={setUser}
            options={userOptions}
            isClearable
            placeholder="Search team members..."
            styles={{
              control: (base) => ({
                ...base, borderColor: '#d1d5db', borderRadius: 8, fontSize: 14, minHeight: 38,
              }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
          {currentUser && !user && (
            <p className="text-xs text-gray-400 mt-1">
              Clearing selection will remove the current user assignment.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm
                       hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className="flex-1 px-4 py-2 bg-primary-pink text-white rounded-lg text-sm font-medium
                       hover:bg-pink-600 transition-colors"
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function OrgChartPage() {
  const { addToast } = useToasts();
  const selectedProject = useSelector(selectSelectedProject);
  const currentUser = useSelector(selectUser);
  const projectId = selectedProject?.id;

  const [root, setRoot] = useState(null);
  const [structureId, setStructureId] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Dialog state
  const [addDialog, setAddDialog] = useState(null);   // { type, nodeId, direction }
  const [assignDialog, setAssignDialog] = useState(null); // { nodeId, currentUser }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, label }

  // Load structure + users on mount
  useEffect(() => {
    if (!projectId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const [structureData, usersResp] = await Promise.all([
          fetchOrgStructure(projectId).catch(() => null),
          axios.get(`/projects/${projectId}/users`).catch(() => ({ data: { body: [] } })),
        ]);

        if (structureData?.structure) {
          setRoot(
            typeof structureData.structure === 'string'
              ? JSON.parse(structureData.structure)
              : structureData.structure
          );
          setStructureId(structureData.id);
        }

        setProjectUsers(usersResp?.data?.body || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const userOptions = projectUsers.map(u => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    avatar: u.avatar,
  }));

  // ── Handlers ──

  const handleCreateRoot = () => setRoot(makeNode('CEO'));

  const handleSave = async () => {
    if (!root || !projectId) return;
    setSaving(true);
    try {
      const payload = { projectId, structure: root };
      if (structureId) {
        await updateOrgStructure(structureId, payload);
      } else {
        const result = await saveOrgStructure(payload);
        if (result?.id) setStructureId(result.id);
      }
      addToast('Organization structure saved successfully', { appearance: 'success' });
    } catch {
      addToast('Failed to save. Please try again.', { appearance: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfirm = async ({ version, summary }) => {
    if (!projectId) { addToast('No project selected', { appearance: 'error' }); return; }
    setIsSaving(true);
    try {
      await createRevisionHistory({
        projectId,
        documentType: DOCUMENT_TYPE,
        version,
        summaryOfChanges: summary,
        revisionDate: new Date().toISOString().split('T')[0],
        name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
        status: 'draft',
      });
      addToast('Document saved as draft', { appearance: 'success' });
      setShowSavePopup(false);
    } catch {
      addToast('Failed to save document', { appearance: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveDoc = async () => {
    if (!projectId) { addToast('No project selected', { appearance: 'error' }); return; }
    setIsApproving(true);
    try {
      await createApproval({
        projectId,
        documentType: DOCUMENT_TYPE,
        approvalDate: new Date().toISOString().split('T')[0],
        status: 'approved',
        approver: {
          id: currentUser?.id,
          name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
          position: currentUser?.position || null,
        },
      });
      addToast('Document approved successfully', { appearance: 'success' });
    } catch {
      addToast('Failed to approve document', { appearance: 'error' });
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenAddChild = (parentId) =>
    setAddDialog({ type: 'child', nodeId: parentId, direction: null });

  const handleOpenAddLeft = (nodeId) =>
    setAddDialog({ type: 'sibling', nodeId, direction: 'left' });

  const handleOpenAddRight = (nodeId) =>
    setAddDialog({ type: 'sibling', nodeId, direction: 'right' });

  const handleConfirmAdd = (label, userOption) => {
    const user = userOption
      ? { id: userOption.value, firstName: userOption.firstName, lastName: userOption.lastName, email: userOption.email, avatar: userOption.avatar }
      : null;
    const newNode = makeNode(label, userOption ? { ...userOption } : null);
    if (user) newNode.user = user;

    if (addDialog.type === 'child') {
      setRoot(prev => addChildNode(prev, addDialog.nodeId, newNode));
    } else {
      setRoot(prev => addSiblingNode(prev, addDialog.nodeId, newNode, addDialog.direction));
    }
    setAddDialog(null);
  };

  const handleDeleteClick = (nodeId) => {
    const node = findNode(root, nodeId);
    setDeleteConfirm({ id: nodeId, label: node?.label });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      setRoot(prev => deleteNodeById(prev, deleteConfirm.id));
      setDeleteConfirm(null);
      addToast('Position removed from structure', { appearance: 'info' });
    }
  };

  const handleEditTitle = (nodeId, label) =>
    setRoot(prev => updateNodeById(prev, nodeId, { label }));

  const handleOpenAssignUser = (nodeId) => {
    const node = findNode(root, nodeId);
    setAssignDialog({ nodeId, currentUser: node?.user || null });
  };

  const handleConfirmAssignUser = (userOption) => {
    const user = userOption
      ? { id: userOption.value, firstName: userOption.firstName, lastName: userOption.lastName, email: userOption.email, avatar: userOption.avatar }
      : null;
    setRoot(prev => updateNodeById(prev, assignDialog.nodeId, { user, userId: user?.id || null }));
    setAssignDialog(null);
  };

  const callbacks = {
    onAddDown: handleOpenAddChild,
    onAddLeft: handleOpenAddLeft,
    onAddRight: handleOpenAddRight,
    onDelete: handleDeleteClick,
    onEditTitle: handleEditTitle,
    onAssignUser: handleOpenAssignUser,
  };

  // ── Render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ArrowPathIcon className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <BuildingOffice2Icon className="w-6 h-6 text-primary-pink" />
          <h4 className="text-xl font-semibold text-gray-800">Organization Structure</h4>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSavePopup(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg
                       hover:bg-pink-600 transition-colors text-sm font-medium shadow-sm"
          >
            Save
          </button>
          <button
            onClick={handleApproveDoc}
            disabled={isApproving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg
                       hover:bg-pink-600 transition-colors disabled:opacity-60 text-sm font-medium shadow-sm"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          {root && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white rounded-lg
                         hover:bg-pink-600 transition-colors disabled:opacity-60 text-sm font-medium shadow-sm"
            >
              {saving
                ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                : <CloudArrowUpIcon className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Chart'}
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      {root && (
        <div className="flex items-center gap-6 px-6 py-2 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-primary-pink flex items-center justify-center">
              <PlusIcon className="w-3 h-3 text-white" />
            </div>
            <span>Left / Right = add peer at same level</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-primary-pink flex items-center justify-center">
              <PlusIcon className="w-3 h-3 text-white" />
            </div>
            <span>Below = add direct report</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <PencilSquareIcon className="w-4 h-4 text-gray-400" />
            <span>Click title to edit · Click avatar to assign user</span>
          </div>
        </div>
      )}

      {/* Chart canvas */}
      <div className="flex-1 overflow-auto" style={{ padding: 56 }}>
        {root ? (
          <div className="flex justify-center" style={{ minWidth: 'max-content' }}>
            <OrgSubtree node={root} isRoot callbacks={callbacks} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center min-h-96">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <BuildingOffice2Icon className="w-12 h-12 text-gray-300" />
            </div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              No Organization Structure Yet
            </h4>
            <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">
              Build your company's org chart by adding positions and assigning team members.
              Start with the top-level position and expand downward.
            </p>
            <button
              onClick={handleCreateRoot}
              className="flex items-center gap-2 px-6 py-3 bg-primary-pink text-white rounded-xl
                         hover:bg-pink-600 transition-colors font-medium shadow-sm text-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Create Organization Structure
            </button>
          </div>
        )}
      </div>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={!!addDialog}
        onClose={() => setAddDialog(null)}
        onConfirm={handleConfirmAdd}
        type={addDialog?.type}
        direction={addDialog?.direction}
        userOptions={userOptions}
      />

      {/* Assign User Modal */}
      <AssignUserModal
        isOpen={!!assignDialog}
        onClose={() => setAssignDialog(null)}
        onConfirm={handleConfirmAssignUser}
        currentUser={assignDialog?.currentUser}
        userOptions={userOptions}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Position"
        message={`Are you sure you want to delete ${deleteConfirm?.label || 'this position'}? All reporting positions under this node will also be removed.`}
      />
      <SaveVersionPopup isOpen={showSavePopup} onClose={() => setShowSavePopup(false)} onConfirm={handleSaveConfirm} isLoading={isSaving} />
    </div>
  );
}

export default OrgChartPage;
