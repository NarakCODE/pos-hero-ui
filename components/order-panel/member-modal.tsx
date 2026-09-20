"use client";

import {
  Avatar,
  Button,
  Label,
  Modal,
  SearchField,
  Separator,
  Surface,
} from "@heroui/react";
import { ChevronRight, Scan } from "reicon-react";
import { useMemo, useState } from "react";

import type { MemberModalProps, MemberProfile } from "./types";

export const DEFAULT_MEMBERS: readonly MemberProfile[] = [
  {
    id: "member-sok-dara",
    name: "Sok Dara",
    tier: "Gold Member",
    points: 1240,
    availableBenefit: "10% Member Discount",
    phone: "012 345 678",
    memberId: "KH-10001",
    scanCode: "MEMBER-10001",
  },
  {
    id: "member-lina-chan",
    name: "Lina Chan",
    tier: "Silver Member",
    points: 560,
    availableBenefit: "5% Member Discount",
    phone: "098 765 432",
    memberId: "KH-10002",
    scanCode: "MEMBER-10002",
  },
];

export function MemberModal({
  appliedMember,
  className = "",
  isOpen,
  members = DEFAULT_MEMBERS,
  onApplyMember,
  onOpenChange,
}: MemberModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="cover">
        {isOpen ? (
          <MemberModalDialog
            appliedMember={appliedMember}
            className={className}
            members={members}
            onApplyMember={onApplyMember}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </Modal.Container>
    </Modal.Backdrop>
  );
}

interface MemberModalDialogProps {
  appliedMember?: MemberProfile | null;
  className?: string;
  members: readonly MemberProfile[];
  onApplyMember?: (member: MemberProfile) => void;
  onClose: () => void;
}

function MemberModalDialog({
  appliedMember,
  className = "",
  members,
  onApplyMember,
  onClose,
}: MemberModalDialogProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    appliedMember?.id ?? null,
  );

  const selectedMember = members.find(
    (member) => member.id === selectedMemberId,
  );

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) =>
      [member.name, member.tier, member.phone, member.memberId, member.scanCode]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [members, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setSelectedMemberId(null);
  };

  const handleScanCode = () => {
    const firstMember = members[0];

    if (!firstMember) {
      return;
    }

    setSearchInput(firstMember.scanCode);
    setSearchQuery(firstMember.scanCode);
    setSelectedMemberId(null);
  };

  const handleChangeMember = () => {
    setSelectedMemberId(null);
    setSearchInput("");
    setSearchQuery("");
  };

  const handleApplyMember = () => {
    if (!selectedMember) {
      return;
    }

    onApplyMember?.(selectedMember);
    onClose();
  };

  return (
    <Modal.Dialog aria-label="Member" className={className}>
      <Modal.CloseTrigger />

      <Modal.Header>
        <div className="space-y-1">
          <Modal.Heading>Member</Modal.Heading>
          <p className="text-sm text-muted">
            Attach one customer to the current order.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {selectedMember ? (
            <SelectedMemberProfile member={selectedMember} />
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <SearchField
                  aria-label="Find member"
                  className="min-w-0 flex-1"
                  fullWidth
                  value={searchInput}
                  variant="secondary"
                  onChange={setSearchInput}
                >
                  <Label>Find member</Label>
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search by phone, ID, or name" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>

                <div className="flex gap-2 sm:shrink-0">
                  <Button size="lg" variant="secondary" onPress={handleSearch}>
                    Search
                  </Button>
                  <Button
                    aria-label="Scan member code"
                    size="lg"
                    variant="ghost"
                    onPress={handleScanCode}
                  >
                    <Scan aria-hidden="true" size={18} />
                    <span className="hidden sm:inline">Scan code</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <Label>Results</Label>
              <div
                aria-label="Member results"
                className="flex max-h-80 min-h-0 flex-col gap-2 overflow-y-auto"
                role="group"
              >
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MemberResult
                      key={member.id}
                      isSelected={selectedMemberId === member.id}
                      member={member}
                      onSelect={setSelectedMemberId}
                    />
                  ))
                ) : (
                  <p className="rounded-xl bg-surface-secondary p-4 text-sm text-muted">
                    No members found. Try another phone number, member ID, or
                    name.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="w-full flex-col gap-3 sm:flex-row">
        {selectedMember ? (
          <>
            <Button
              className="w-full sm:flex-1"
              fullWidth
              size="lg"
              variant="secondary"
              onPress={handleChangeMember}
            >
              Change Member
            </Button>
            <Button
              className="w-full sm:flex-1"
              fullWidth
              size="lg"
              onPress={handleApplyMember}
            >
              Apply Member
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-full sm:flex-1"
              fullWidth
              size="lg"
              slot="close"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button className="w-full sm:flex-1" fullWidth isDisabled size="lg">
              Apply Member
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal.Dialog>
  );
}

function MemberResult({
  isSelected,
  member,
  onSelect,
}: {
  isSelected: boolean;
  member: MemberProfile;
  onSelect: (memberId: string) => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      className="w-full text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      type="button"
      onClick={() => onSelect(member.id)}
    >
      <Surface
        className="flex min-h-20 w-full items-center gap-3 p-3 outline outline-1 -outline-offset-1 outline-border hover:bg-surface-secondary"
        variant={isSelected ? "tertiary" : "default"}
      >
        <MemberAvatar member={member} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted">{member.tier}</p>
          <p className="mt-1 text-xs text-muted">
            {formatPoints(member.points)} points
          </p>
        </div>
        <ChevronRight
          aria-hidden="true"
          className="shrink-0 text-muted"
          size={18}
        />
      </Surface>
    </button>
  );
}

function SelectedMemberProfile({ member }: { member: MemberProfile }) {
  return (
    <Surface className="flex flex-col gap-5 p-5 sm:p-6" variant="secondary">
      <div className="flex items-center gap-4">
        <MemberAvatar member={member} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{member.name}</p>
          <p className="text-sm text-muted">{member.tier}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MemberMetric label="Points" value={formatPoints(member.points)} />
        <MemberMetric
          label="Available benefit"
          value={member.availableBenefit}
        />
      </div>
    </Surface>
  );
}

function MemberMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function MemberAvatar({
  member,
  size = "md",
}: {
  member: MemberProfile;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Avatar size={size}>
      <Avatar.Fallback>{getInitials(member.name)}</Avatar.Fallback>
    </Avatar>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatPoints(points: number) {
  return points.toLocaleString("en-US");
}
