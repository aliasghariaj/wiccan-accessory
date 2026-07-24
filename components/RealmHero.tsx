type Props = {
  title: string;
  description: string;
};


export default function RealmHero({
  title,
  description
}: Props){

return(
<section>

<h1>
{title}
</h1>

<p>
{description}
</p>

</section>
)

}