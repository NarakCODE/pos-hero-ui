"use client";

import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { IconPlus } from "@tabler/icons-react";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import type { CustomerTier } from "./customer-data";

export interface CreateCustomerFormData {
  name: string;
  phone: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  tier: CustomerTier;
  notes: string;
}

interface CreateCustomerModalProps {
  onCreate?: (data: CreateCustomerFormData) => void;
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phonePattern = /^(?=(?:\D*\d){8,})[+\d][\d\s()-]+$/;
const genderOptions = [
  { id: "male", labelKey: "genderMale" },
  { id: "female", labelKey: "genderFemale" },
  { id: "other", labelKey: "genderOther" },
] as const;
const tierOptions = [
  { id: "member", labelKey: "tierMember" },
  { id: "gold", labelKey: "tierGold" },
  { id: "vip", labelKey: "tierVip" },
  { id: "black", labelKey: "tierBlack" },
] as const satisfies ReadonlyArray<{
  id: CustomerTier;
  labelKey: string;
}>;

export function CreateCustomerModal({ onCreate }: CreateCustomerModalProps) {
  const t = useTranslations("Customer");
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);

    if (!nextIsOpen) {
      setFormKey((currentKey) => currentKey + 1);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: CreateCustomerFormData = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      gender: String(formData.get("gender") ?? ""),
      dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
      tier: String(formData.get("tier") ?? "member") as CustomerTier,
      notes: String(formData.get("notes") ?? "").trim(),
    };

    onCreate?.(data);
    toast.success(t("successTitle"), {
      description: t("successDescription", {
        name: data.name,
      }),
    });
    handleOpenChange(false);
  };

  return (
    <Modal>
      <Button
        aria-label={t("addCustomer")}
        isIconOnly
        size="lg"
        type="button"
        variant="secondary"
        onPress={() => setIsOpen(true)}
      >
        <IconPlus aria-hidden="true" size={20} />
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={handleOpenChange}
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog
            aria-describedby="create-customer-description"
            aria-labelledby="create-customer-title"
          >
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading id="create-customer-title">
                {t("createTitle")}
              </Modal.Heading>
            </Modal.Header>

            <Form
              id="create-customer-form"
              key={formKey}
              aria-labelledby="create-customer-title"
              onSubmit={handleSubmit}
              className="h-full w-full flex items-center justify-center"
            >
              <Modal.Body>
                <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                  <TextField
                    fullWidth
                    isRequired
                    minLength={2}
                    name="name"
                    validate={(value) =>
                      value.trim().length < 2
                        ? t("nameError")
                        : null
                    }
                  >
                    <Label>{t("name")}</Label>
                    <Input
                      autoComplete="name"
                      placeholder={t("namePlaceholder")}
                      variant="secondary"
                    />
                    <FieldError />
                  </TextField>

                  <TextField
                    fullWidth
                    isRequired
                    name="phone"
                    type="tel"
                    validate={(value) =>
                      !phonePattern.test(value.trim())
                        ? t("phoneError")
                        : null
                    }
                  >
                    <Label>{t("phone")}</Label>
                    <Input
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={t("phonePlaceholder")}
                      variant="secondary"
                    />
                    <FieldError />
                  </TextField>

                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    validate={(value) =>
                      value.trim() && !emailPattern.test(value.trim())
                        ? t("emailError")
                        : null
                    }
                  >
                    <Label>{t("email")}</Label>
                    <Input
                      autoComplete="email"
                      placeholder={t("emailPlaceholder")}
                      variant="secondary"
                    />
                    <FieldError />
                  </TextField>

                  <DatePicker className="w-full" name="dateOfBirth">
                    <Label>{t("dateOfBirth")}</Label>
                    <DateField.Group fullWidth variant="secondary">
                      <DateField.Input>
                        {(segment) => <DateField.Segment segment={segment} />}
                      </DateField.Input>
                      <DateField.Suffix>
                        <DatePicker.Trigger>
                          <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>
                    <DatePicker.Popover>
                      <Calendar aria-label={t("dateOfBirth")}>
                        <Calendar.Header>
                          <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => (
                              <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                            )}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => (
                              <Calendar.YearPickerCell year={year} />
                            )}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>

                  <Select
                    fullWidth
                    name="gender"
                    placeholder={t("genderPlaceholder")}
                    variant="secondary"
                  >
                    <Label>{t("gender")}</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover placement="bottom start">
                      <ListBox>
                        {genderOptions.map((option) => (
                          <ListBox.Item
                            key={option.id}
                            id={option.id}
                            textValue={t(option.labelKey)}
                          >
                            {t(option.labelKey)}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    defaultValue="member"
                    fullWidth
                    isRequired
                    name="tier"
                    variant="secondary"
                  >
                    <Label>{t("membershipTier")}</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover placement="bottom start">
                      <ListBox>
                        {tierOptions.map((option) => (
                          <ListBox.Item
                            key={option.id}
                            id={option.id}
                            textValue={t(option.labelKey)}
                          >
                            {t(option.labelKey)}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div className="sm:col-span-2">
                    <TextField fullWidth name="notes">
                      <Label>{t("notes")}</Label>
                      <TextArea
                        fullWidth
                        placeholder={t("notesPlaceholder")}
                        rows={8}
                        variant="secondary"
                      />
                    </TextField>
                  </div>
                </div>
              </Modal.Body>
            </Form>

            <Modal.Footer>
              <Button
                slot="close"
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
              >
                {t("cancel")}
              </Button>
              <Button
                form="create-customer-form"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
              >
                {t("submit")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
