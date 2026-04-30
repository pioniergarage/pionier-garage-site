
export interface Props {
    color: string;
    label: string;
}

export default function Tag({ color, label }: Props) {
    return (
        <span
            key={`${color}-${label}`}
            className={`tag-item tag-item--${color}`}
        >
            {label}
        </span>
    )
}