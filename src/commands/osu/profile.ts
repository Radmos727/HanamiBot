import { getCommandArgs } from "../../utils/args";
import { profileBuilder } from "../../embed-builders/profile";
import { client } from "../../utils/initalize";
import { UserType } from "../../types/commandArgs";
import { EmbedBuilderType } from "../../types/embedBuilders";
import { ApplicationCommandOptionType } from "lilybird";
import type { ApplicationCommandData, Interaction } from "lilybird";
import type { SlashCommand } from "@lilybird/handlers";

export default {
    post: "GLOBAL",
    data: {
        name: "profile",
        description: "Display statistics of a user.",
        options: [
            {
                type: ApplicationCommandOptionType.STRING,
                name: "username",
                description: "Specify an osu! username"
            },
            {
                type: ApplicationCommandOptionType.STRING,
                name: "mode",
                description: "Specify an osu! mode",
                choices: [ { name: "osu", value: "osu" }, { name: "mania", value: "mania" }, { name: "taiko", value: "taiko" }, { name: "ctb", value: "fruits" } ]
            },
            {
                type: ApplicationCommandOptionType.USER,
                name: "discord",
                description: "Specify a linked Discord user"
            }
        ]
    },
    run
} satisfies SlashCommand;

async function run(interaction: Interaction<ApplicationCommandData>): Promise<void> {
    if (!interaction.inGuild()) return;
    await interaction.deferReply();

    const args = getCommandArgs(interaction);

    if (typeof args === "undefined") return;
    const { user } = args;

    if (user.type === UserType.FAIL) {
        await interaction.editReply(user.failMessage);
        return;
    }

    const osuUser = await client.users.getUser(user.banchoId, { urlParams: { mode: user.mode } });
    if (!osuUser.id) {
        await interaction.editReply("This user does not exist.");
        return;
    }

    const embeds = profileBuilder({
        type: EmbedBuilderType.PROFILE,
        initiatorId: interaction.member.user.id,
        user: osuUser,
        mode: user.mode
    });

    await interaction.editReply({ embeds });
}
