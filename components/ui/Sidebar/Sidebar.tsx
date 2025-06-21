"use client";

import { supabase } from "@/api/supabase";
import {
  ActionIcon,
  Avatar,
  Code,
  Flex,
  NavLink,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpDownIcon,
  AxeIcon,
  CalendarIcon,
  GithubIcon,
  ListTodoIcon,
  LogOutIcon,
  MoreVerticalIcon,
  Settings2Icon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image.js";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const links = [
  { icon: AxeIcon, label: "Activity", notifications: 3 },
  { icon: AxeIcon, label: "Tasks", notifications: 4 },
  { icon: AxeIcon, label: "Contacts" },
];

const collections = [
  { emoji: "👍", label: "Sales" },
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "🛒", label: "Orders" },
  { emoji: "📅", label: "Events" },
  { emoji: "🙈", label: "Debts" },
  { emoji: "💁‍♀️", label: "Customers" },
];

export function Sidebar() {
  const { data: user } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  console.log({ user });

  const isAuth = user ? true : false;

  const { data: projects } = useQuery({
    queryKey: ["get-projects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*");
      return data;
    },
    enabled: isAuth,
  });

  console.log({ projects });

  const onGithubLoginClick = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    console.log("Authorized: ", data, error);
  };

  const onGithubLogoutClick = async () => {
    let { error } = await supabase.auth.signOut();
    console.log("Logout: ", error);
  };

  return (
    <div className={styles.sidebar}>
      {/* HEADER */}
      <div className={styles.item}>
        <div className={styles.content}>
          <Image src={"/favicon.svg"} width={32} height={32} alt="logo" />
          <Text fw={"bold"}>Diogen</Text>
        </div>
        <div className={styles.actions}>
          <ActionIcon size={"lg"} variant="transparent">
            <SettingsIcon />
          </ActionIcon>
          <ActionIcon size={"lg"} variant="transparent">
            <ArrowUpDownIcon />
          </ActionIcon>
        </div>
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        // leftSection={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={styles.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      />

      {/* MENU LIST */}
      <div className={styles.item}>
        <div className={styles.content}>
          <Text fw={"bold"} c={"dark.2"}>
            Menu
          </Text>
        </div>
        <div className={styles.actions}>
          <ActionIcon size={"md"} c={"dark.2"} variant="transparent">
            <Settings2Icon />
          </ActionIcon>
        </div>
      </div>
      <NavLink
        href="/today"
        component={Link}
        label="Today"
        leftSection={<CalendarIcon />}
        p={"xs"}
      />
      <NavLink
        href="/tasks"
        component={Link}
        label="Tasks"
        leftSection={<ListTodoIcon />}
        p={"xs"}
      />
      {/* <Space /> */}

      {/* PROJECTS LIST */}
      <div className={styles.item}>
        <div className={styles.content}>
          <Text fw={"bold"} c={"dark.2"}>
            Projects
          </Text>
        </div>
        <div className={styles.actions}>
          <ActionIcon size={"md"} c={"dark.2"} variant="transparent">
            <Settings2Icon />
          </ActionIcon>
        </div>
      </div>

      {projects &&
        projects.length &&
        projects.map((project) => {
          return (
            <NavLink
              key={project.id}
              label={project.title}
              component={Link}
              href={`/projects/${project.custom_id}`}
              fw={"bold"}
              fz={"sm"}
              leftSection={
                <div
                  style={{ backgroundColor: project.color }}
                  className={styles.project_circle}
                ></div>
              }
              rightSection={
                <Flex gap={"xs"}>
                  <ActionIcon size={"sm"} c={"dark.2"} variant="transparent">
                    <TrashIcon />
                  </ActionIcon>

                  <ActionIcon size={"sm"} c={"dark.2"} variant="transparent">
                    <MoreVerticalIcon />
                  </ActionIcon>
                </Flex>
              }
              p={"xs"}
            />
            // <div className={styles.item}>
            //   <div className={styles.content}>
            //
            //     <Text fw={"bold"}>{project.title}</Text>
            //   </div>
            //   <div className={styles.actions}>

            //   </div>
            // </div>
          );
        })}

      {/* <div className={styles.bottom}>
        
      </div> */}

      <div className={styles.bottom}>
        {isAuth ? (
          <>
            <div className={styles.account}>
              <Avatar>
                <UserIcon className={styles.avatar} />
              </Avatar>
              <Text fw={"bold"}>{user && user.email}</Text>
            </div>
            <div className={styles.actions}>
              <ActionIcon
                size={"lg"}
                variant="transparent"
                onClick={onGithubLogoutClick}
              >
                <LogOutIcon />
              </ActionIcon>
            </div>
          </>
        ) : (
          <div className={styles.authorization} onClick={onGithubLoginClick}>
            <Avatar>
              <GithubIcon className={styles.avatar} />
            </Avatar>
            <Text fw={"bold"}>Auth with Github</Text>
          </div>
        )}

        {/* <div className={styles.actions}>
          <LogInIcon />
        </div> */}
      </div>

      {/* <div className={styles.item}>
        <div className={styles.content}>
          <div className={styles.project_circle_indigo}></div>
          <Text fw={"bold"}>Oku</Text>
        </div>
        <div className={styles.actions}>
          <ActionIcon size={"sm"} c={"dark.2"} variant="transparent">
            <TrashIcon />
          </ActionIcon>

          <ActionIcon size={"sm"} c={"dark.2"} variant="transparent">
            <MoreVerticalIcon />
          </ActionIcon>
        </div>
      </div> */}

      {/* <div className={styles.section}>
        <Group className={styles.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={styles.collections}>{collectionLinks}</div> */}
    </div>
  );
}
