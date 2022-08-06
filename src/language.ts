export const english = {
    speed: (ms: number) => `Speed, ${ms}`,
    monitoring: (on_off: boolean) => `Monitoring ${on_off ? "on" : "off"}`,
    chart_label: (title: string) => `${title}, Sonified chart`,

    hotkey_right: () => `Go to next point`,
    hotkey_left: () => `Go to previous point`,
    hotkey_play_left: () => `Play left`,
    hotkey_play_right: () => `Play right`,
    hotkey_cancel_play: () => `Cancel play`,
    hotkey_previous_stat: () => `Navigate to previous statistic`,
    hotkey_next_stat: () => `Navigate to next statistic`,
    hotkey_previous_category: () => `Navigate to previous category`,
    hotkey_next_category: () => `Navigate to next category`,
    hotkey_first: () => `Go to first point`,
    hotkey_end: () => `Go to last point`,
    hotkey_play_all_left: () => `Play all left`,
    hotkey_play_all_right: () => `Play all right`,
    hotkey_replay: () => `Replay`,
    hotkey_backward_tenth: () => `Go backward by a tenth`,
    hotkey_forward_tenth: () => `Go forward by a tenth`,
    hotkey_jump_minimum: () => `Go to minimum value`,
    hotkey_jump_maximum: () => `Go to maximum value`,
    hotkey_speed_incr: () => `Speed up`,
    hotkey_speed_decr: () => `Slow down`,
    hotkey_toggle_monitor: () => `Toggle monitor mode`,
    hotkey_help: () => `Open help dialog`,

    error_unknown_group: (unknown_group: string, valid_groups: string[]) =>
        `Error adding data to unknown group name "${unknown_group}". ${
            valid_groups.length === 1
                ? "There are no group names."
                : `Valid groups: ${valid_groups.join(", ")}`
        } `,
    error_mismatched_type: (addedType: string, targetType: string) =>
        `Mismatched type error. Trying to add data of type ${addedType} to target data of type ${targetType}.`
};
