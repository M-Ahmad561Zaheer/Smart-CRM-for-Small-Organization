import { SchoolBottomNav } from '@/components/school/school-navigation';
import { Text } from '@/components/responsive-text';
import { schoolTheme } from './theme';
import { useFeeInvoices } from '../alerts-store';
import { router } from 'expo-router';

import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

const C = {
  background: schoolTheme.background,
  white: schoolTheme.surface,
  black: schoolTheme.text,
  primary: schoolTheme.primary,
  text: schoolTheme.text,
  muted: schoolTheme.muted,
  border: schoolTheme.border,
  light: schoolTheme.primarySoft,
};

type Invoice = {
  id: string;
  client: string;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
};

const invoices: Invoice[] = [
  {
    id: "INV-8842",
    client: "Acme Corp.",
    date: "Oct 24, 2023",
    status: "Pending",
  },
  {
    id: "INV-8841",
    client: "Globex Ltd.",
    date: "Oct 22, 2023",
    status: "Paid",
  },
  {
    id: "INV-8840",
    client: "Soylent Corp.",
    date: "Oct 20, 2023",
    status: "Overdue",
  },
  {
    id: "INV-8839",
    client: "Initech Inc.",
    date: "Oct 18, 2023",
    status: "Paid",
  },
  {
    id: "INV-8838",
    client: "Umbrella Ltd.",
    date: "Oct 15, 2023",
    status: "Pending",
  },
  {
    id: "INV-8837",
    client: "Stark Industries",
    date: "Oct 12, 2023",
    status: "Overdue",
  },
  {
    id: "INV-8836",
    client: "Wayne Enterprises",
    date: "Oct 10, 2023",
    status: "Paid",
  },
  {
    id: "INV-8835",
    client: "Aperture Labs",
    date: "Oct 8, 2023",
    status: "Pending",
  },
];

const PAGE_SIZE = 4;

function MetricCard({
  label,
  amount,
  description,
  icon,
}: {
  label: string;
  amount: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricTop}>
        <Text style={styles.metricLabel}>
          {label}
        </Text>
        <Ionicons
          name={icon}
          size={19}
          color="#555555"
        />
      </View>

      <Text style={styles.metricAmount}>
        {amount}
      </Text>

      <Text style={styles.metricDescription}>
        {description}
      </Text>
    </View>
  );
}

function InvoiceRow({ item }: { item: Invoice }) {
  return (
    <View style={styles.invoiceRow}>
      <View style={styles.idColumn}>
        <Text style={styles.invoiceId}>
          #{item.id}
        </Text>
      </View>

      <View style={styles.clientColumn}>
        <View style={styles.clientImage}>
          <Ionicons
            name="image-outline"
            size={16}
            color="#D5D5D5"
          />
        </View>
        <Text
          style={styles.clientText}
          numberOfLines={2}
        >
          {item.client}
        </Text>
      </View>

      <View style={styles.dateColumn}>
        <Text style={styles.dateText}>
          {item.date}
        </Text>
      </View>
    </View>
  );
}

export default function FeeManagementScreen() {
  const generated = useFeeInvoices();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<
    "All" | "Paid" | "Pending" | "Overdue"
  >("All");
const filteredInvoices = useMemo(() => {
    return [...generated.map(item=>({id:item.id,client:item.student,date:item.due,status:"Pending" as const})),...invoices].filter((item) => {
      const matchesStatus =
        filter === "All" || item.status === filter;

      return matchesStatus;
    });
  }, [filter, generated]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / PAGE_SIZE)
  );

  const visibleInvoices = filteredInvoices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function nextFilter() {
    const options = [
      "All",
      "Paid",
      "Pending",
      "Overdue",
    ] as const;

    const currentIndex = options.indexOf(filter);
    const nextIndex = (currentIndex + 1) % options.length;

    setFilter(options[nextIndex]);
    setPage(1);
  }

  function showPlaceholder(feature: string) {
    Alert.alert(
      feature,
      "This feature will be connected in a later development phase."
    );
  }

return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.pageTitle}>
            Fee Management
          </Text>

          <Text style={styles.subtitle}>
            Track billing, invoices, and pending payments.
          </Text>

          <Pressable
            style={styles.createButton}
            onPress={() =>
              router.push("/create-fee-invoice")
            }
          >
            <Ionicons
              name="add"
              size={15}
              color="#FFFFFF"
            />

            <Text style={styles.createButtonText}>
              CREATE NEW INVOICE
            </Text>
          </Pressable>
        </View>

        <View style={styles.metrics}>
          <MetricCard
            label="PENDING REVENUE"
            amount="$12,450.00"
            description="14 Unpaid invoices"
            icon="ellipsis-horizontal-circle-outline"
          />

          <MetricCard
            label="RECEIVED (30D)"
            amount="$45,200.00"
            description="32 Settled this month"
            icon="checkmark-circle-outline"
          />

          <MetricCard
            label="OVERDUE"
            amount="$3,100.00"
            description="3 Invoices past due date"
            icon="warning-outline"
          />
        </View>

        <View style={styles.invoiceCard}>
          <View style={styles.invoiceHeading}>
            <Text style={styles.sectionTitle}>
              Recent Invoices
            </Text>

            <View style={styles.headingButtons}>
              <Pressable
                style={[styles.smallButton, filter !== "All" && {borderColor:C.primary}]}
                onPress={nextFilter}
              >
                <Text style={styles.smallButtonText}>
                  {filter === "All" ? "Filter" : filter}
                </Text>
              </Pressable>

              <Pressable
                style={styles.smallButton}
                onPress={() =>
                  showPlaceholder("Export Invoices")
                }
              >
                <Text style={styles.smallButtonText}>
                  Export
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text
              style={[
                styles.columnHeader,
                styles.idColumn,
              ]}
            >
              INVOICE
            </Text>

            <Text
              style={[
                styles.columnHeader,
                styles.clientColumn,
              ]}
            >
              CLIENT
            </Text>

            <Text
              style={[
                styles.columnHeader,
                styles.dateColumn,
              ]}
            >
              DATE
            </Text>
          </View>

          {visibleInvoices.length ? (
            visibleInvoices.map((item) => (
              <InvoiceRow key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No invoices found
              </Text>
            </View>
          )}

          <View style={styles.pagination}>
            <Text style={styles.paginationInfo}>
              {filteredInvoices.length === 0
                ? "Showing 0 invoices"
                : `Showing ${
                    (page - 1) * PAGE_SIZE + 1
                  } of ${filteredInvoices.length} invoices`}
            </Text>

            <View style={styles.paginationButtons}>
              <Pressable
                style={[
                  styles.pageButton,
                  page === 1 && styles.disabledButton,
                ]}
                disabled={page === 1}
                onPress={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
              >
                <Text style={styles.pageButtonText}>
                  Previous
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pageButton,
                  page >= totalPages &&
                    styles.disabledButton,
                ]}
                disabled={page >= totalPages}
                onPress={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
              >
                <Text style={styles.pageButtonText}>
                  Next
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Screen-specific bottom navigation */}
      <SchoolBottomNav/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,
  },
  intro: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
  },
  subtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
    marginBottom: 8,
  },
  createButton: {
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  metrics: {
    gap: 22,
    marginBottom: 27,
  },
  metricCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    minHeight: 124,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
  },
  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: C.muted,
    letterSpacing: 0.6,
  },
  metricAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    marginTop: 7,
  },
  metricDescription: {
    fontSize: 11,
    color: C.muted,
    marginTop: 5,
  },
  invoiceCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  invoiceHeading: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.black,
  },
  headingButtons: {
    flexDirection: "row",
    gap: 7,
  },
  smallButton: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: schoolTheme.primarySoft,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallButtonText: {
    fontSize: 10,
    color: C.primary,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: schoolTheme.primarySoft,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 17,
    paddingVertical: 13,
  },
  columnHeader: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
  },
  idColumn: {
    width: "31%",
  },
  clientColumn: {
    width: "43%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dateColumn: {
    width: "26%",
  },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    paddingVertical: 18,
    minHeight: 82,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  invoiceId: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  clientImage: {
    height: 26,
    width: 22,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clientText: {
    fontSize: 12,
    color: C.text,
    flexShrink: 1,
  },
  dateText: {
    fontSize: 11,
    color: C.text,
    lineHeight: 15,
  },
  emptyState: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: C.muted,
    fontSize: 13,
  },
  pagination: {
    paddingHorizontal: 17,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paginationInfo: {
    fontSize: 10,
    color: C.muted,
    flexShrink: 1,
  },
  paginationButtons: {
    flexDirection: "row",
    gap: 7,
  },
  pageButton: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.45,
  },
  pageButtonText: {
    fontSize: 10,
    color: C.primary,
  },
  bottomNav: {
    minHeight: 66,
    flexDirection: "row",
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  bottomLabel: {
    fontSize: 10,
    color: C.muted,
  },
  bottomActive: {
    color: C.primary,
    fontWeight: "700",
  },
});
